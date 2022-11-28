
const express = require('express');
// router instance.
const router = express.Router();
const { authenticateUser } = require('../middleware/auth-user');
const course = require('../models/course');


// Models to import 
const User = require('../models').User;
const Course = require('../models').Course;

/* Handler function to wrap each route. */
function asyncHandler(cb) {
    return async (req, res, next) => {
      try {
        await cb(req, res, next);
      } catch(error){
        // Forward error to the global error handler
        next(error);
      }
    };
  }
  
// User routes
// Route that returns the current authenticated user along with 200http status code.
router.get('/users', authenticateUser, asyncHandler(async (req,res) => {
 
    //retrive current authenticated user's info from req object 'currentUser' property:
    const user = req.currentUser; //will set currentUser prop if and only succfully authenticated.
    // console.log(user);

    // response object json method to return current user info formatted in json.
    res.status(200).json(user);
}));

// Post route that will create new user. Set location header to "/" and return 201 status code w no content.

router.post('/users', asyncHandler(async(req, res) => {
    try { 
    await User.create(req.body); //creates new user 
    res.location("/").status(201).end(); // return 
    } catch (error) {
        console.log('ERROR: ', error.name);




        if(error.name === "SequelizeValidationError" || error.name === 'SequelizeUniqueConstraintError') { // checking the error
            const errors = error.errors.map((err) => err.message);
            res.status(400).json({ errors });  

        } else {
            throw error; // error caught in the asyncHandler's catch block
        }
}
}));

// Course routes --- 

// A GET route that will return all courses including the User associated with each course and a 200 HTTP status code.
router.get('/courses', asyncHandler(async(req, res) =>{
// Get all courses, and include the model associations
const courses = await Course.findAll({
  include: [
    {
      model: User,
      as: 'user',
    }
  ]
});

res.status(200).json(courses);
}
));

// *GET* route that will return the corresponding course including the User associated with that course and a 200 HTTP status code.
router.get('/courses/:id', asyncHandler(async(req, res) =>{
  // return corresponding course + User/model associated.
  const course = await Course.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'user',
      }
    ]
  });
  
  res.status(200).json(course);
  }
  ));

// *POST* route that will create a new course, set the Location header to the URI for the newly created course, and return a 201 HTTP status code and no content.
// + custom middleware to authenticate route
router.post('/courses', authenticateUser, asyncHandler(async(req,res) => {
  try {
    if (req.currentUser) {
    let course = await Course.create(req.body);
    res.location('/courses/' + `${course.id}`).status(201).end();

    } else {
      res.status(401).json({message: "You don't have access to update this course."});
    }

  } catch (error) {

    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });  
    } else {
      throw error; // error caught in the asyncHandler's catch block
    }
  }
}));



// // *PUT*  route that will update the corresponding course and return a 204 HTTP status code and no content.
// + custom middleware to authenticate route
router.put("/courses/:id", authenticateUser, asyncHandler(async (req, res) => {
    try {
      let course = await Course.findByPk(req.params.id);
      if (course) {
        if (course.userId === req.currentUser.id ) { //ensure that the currently authenticated user is the owner of the requested course.
          await course.update(req.body);
          res.status(204).end();
        } else {
          res.status(403).json({ message: 'You do not have access to update this course' });
        }
      } else {
        res.status(404).json({ message: 'Course Not Found' });
      }
    } catch (error) {
      console.log("ERROR: ", error.name);
      if ( error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error; // error caught in the asyncHandler's catch block
      }
    }
  }));

// // *DELETE* A /api/courses/:id DELETE route that will delete the corresponding course and return a 204 HTTP status code and no content.
// + custom middleware to authenticate route
router.delete("/courses/:id", authenticateUser, asyncHandler(async (req, res) => {
    
  try {
      const course = await Course.findByPk(req.params.id);

      if (course) {
        if (req.currentUser.id === course.userId){ //ensure that the currently authenticated user is the owner of the requested course.
          await course.destroy();
          res.status(204).end();
        } else {
          res.status(401).json({ message: "You don't have access to delete this course" });
        }
      } else {
        res.status(404).json({ message: 'Route Not Found' });
      }
    } catch (error) {
      console.log("ERORR: ", error.name);
    }
  }));

module.exports = router;
