
const express = require('express');
// router instance.
const router = express.Router();
const { authenticateUser } = require('../middleware/auth-user');


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
  
// // // User routes
// // // Route that returns the current authenticated user along with 200http status code.
// // router.get('/users', authenticateUser, asyncHandler(async (req,res) => {
    
// //     //retrive current authenticated user's info from req object 'currentUser' property:
// //     const user = req.currentUser; //will set currentUser prop if and only succfully authenticated.
// //     // console.log(user);

// //     // response object json method to return current user info formatted in json.
// //     res.status(200).json(user);
// // }));

// // Course route

// module.exports = router;
