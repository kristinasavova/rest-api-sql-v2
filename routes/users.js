'use strict'; 

const express = require ('express'); 
const router = express.Router (); 
const { User } = require ('../models'); 
const { check, validationResult } = require ('express-validator'); 
const bcryptjs = require ('bcryptjs'); 
const authenticateUser = require ('./authentication');

/* Send a GET request to /api/users to READ the currently authenticated user with 
a status code 200. */  

/* Passing the authenticateUser middleware func ahead of the router handler tells Express to route 
GET req to the path "/api/users" first to the custom middleware func and then to the inline router handler func. */ 
router.get ('/users', authenticateUser, async (req, res) => { 
    /* The current authenticated user's info is retrieved from the Req object's currentUser property. 
    The authenticateUser middleware func will set the currentUser property on Req only if the req is authenticated. */
    const user = req.currentUser; 
    res.status (200).json ({ 
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.emailAddress 
    });
});

/* Send a POST request to api/users to CREATE a new user, set the Location header to 
"/", and returns no content with a status code 201. */

router.post ('/users', [
    check ('firstName')
        .exists ({ checkFalsy: true, checkNull: true })
        .withMessage ('Please provide a value for "First Name"'),
    check ('lastName')
        .exists ({ checkFalsy: true, checkNull: true })
        .withMessage ('Please provide a value for "Last Name"'),
    check ('emailAddress')
        .exists ({ checkFalsy: true, checkNull: true })
        .withMessage ('Please provide a value for "Email Address"')
        .isEmail ()
        .withMessage ('Please provide a valid email address for "Email Address"')
        .normalizeEmail ()
        .custom ( (value, { req }) => { 
            new Promise ( (resolve, reject) => {
                User.findAll ({ where: { emailAddress: value }}), (err, user) => {
                    if (user) {
                        reject (new Error ('This e-mail address is already in use'));
                    } else {
                        resolve (); 
                    }
                } 
            }).then ( () => console.log ('Promise resolved'));  
        }),
    check ('password')
        .exists ({ checkFalsy: true, checkNull: true })
        .withMessage ('Please provide a value for "Password"')
], async (req, res, next) => {
    // Attempt to get the validation result from the request object
    const errors = validationResult (req); 
    // ValidationResult returns a validation result object which provides an isEmpty method 
    if (!errors.isEmpty ()) {
        // Validation result object's array method gets a standard array of validation errors
        const errorMessages = errors.array ().map (error => error.msg);
        res.status (400).json ({ errors: errorMessages });     
    }
    try {
        const user = req.body; // get the user from the request body 
        user.password = bcryptjs.hashSync (user.password); // hash the new user's password  
        await User.create (user); 
        /* The Location response-header field is used to redirect the recipient to a location other than 
        the Request-URI for completion of the request or identification of a new resource. For 201 (Created) 
        responses, the Location is that of the new resource which was created by the request. */   
        res.status (201).set ('Location', '/').end ();
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            res.status (400).json ({ errors: error.errors });
            console.log ('Validation failed', error);
            next (error); 
        } else {
            next (error); 
        } 
    }
});

module.exports = router; 