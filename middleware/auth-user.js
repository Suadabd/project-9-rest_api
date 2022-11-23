'use strict';

const auth = require('basic-auth');
const { User } = require('../models');
// const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');


// Middleware to authenticate the request using Basic Auth.
exports.authenticateUser = async (req, res, next) => {

    let message; 

   // Parse the user's credentials from the Authorization header.
   const credentials = auth(req);

  // If the user's credentials are available...
    if (credentials) {
        const user = await User.findOne({ where: {emailAddress: credentials.name} });

         // If a user was successfully retrieved from the data store...
        if (user) {
            const authenticated = bcrypt.compareSync(credentials.pass, user.password);

            if(authenticated) { // If the passwords match...
                console.log(`Authentication successful for username: ${user.emailAddress}`);

                 // Store the user on the Request object.
                req.currentUser = user;
                //req.currentUser means that you're adding a property named currentUser to the request object and setting it to the authenticated user.
                
            } else {
                message = `Authentication failure for username: ${user.emailAddress}`;
            }
        } else {
            message = `User not found for username: ${credentials.name}`;
        }
     } else {
            message = 'Auth header not found';
        }


    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
        }
};