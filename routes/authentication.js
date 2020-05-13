const express = require ('express'); 
const router = express.Router ();   
const { User } = require ('../models'); 
const auth = require ('basic-auth'); // a library to parse the authorization header 
const bcryptjs = require ('bcryptjs');  

const authenticateUser = async (req, res, next) => {
    let message = null; 
    const credentials = auth (req); // parse the user's credentials from the Authorization header 
    /* The user's credentials contain two values: a name — the user's email address — and a pass —
    the user's password (in clear text) */
    if (credentials) {
        const user = await User.findOne ({ where: {
            emailAddress: credentials.name // use user's email address to attempt to retrieve user from the database
        }}); 
        /* If a user was retrieved from the database, use the bcryptjs to compare the password (from the Authorization header) 
        to the password from the database. */
        if (user) {
            const authenticated = bcryptjs.compareSync (credentials.pass, user.password); 
            /* If passwords match, store the retrieved user object on the req so any middleware 
            that follow this middleware will have access to the user's info. */ 
            if (authenticated) {
                req.currentUser = user;  
            } else {
                message = `Authentication failure for username: ${user.emailAddress}`;
            }    
        } else {
            message = `User not found for username: ${credentials.name}`; 
        }
    } else {
        message = 'Auth header not found'; 
    } 
    /* If authentication failed, return a response with a 401 Unauthorized HTTP status code. Or if 
    user authentication succeeded, call the next method. */
    if (message) {
        console.warn (message); 
        res.status (401).json ({ message: 'Access Denied' }); 
    } else {
        next (); 
    }
};

module.exports = authenticateUser; 