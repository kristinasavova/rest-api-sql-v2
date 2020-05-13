'use strict'; 

const express = require ('express');
const router = express.Router (); 
const { sequelize } = require ('../models'); 
const { Course } = require ('../models'); 
const { User } = require ('../models');
const authenticateUser = require ('./authentication');  

/* A middleware to wrap each of the route in a try-catch block, so we don't have to explicitly 
write it over and over again. */

function asyncHandler (cb) {
    // return async func that will serve as our route handlers callback
    return async (req, res, next) => {
        try {
            // await whatever func we've passed to the asyncHandler with normal route handling params
            cb (req, res, next);
        } catch (error) {
            console.log ('Something is wrong with the routes', error); 
            next (error); 
        }
    };
}; 

/* Send a GET request to /api/courses to READ a list of courses (including the user that owns 
each course) with a status code 200 */

router.get ('/courses', asyncHandler ( async (req, res, next) => {
    const courses = await Course.findAll ({
        include: [{
            model: User,
            as: 'teacher' // alias 
        }]    
    }); 
    res.json (courses);  
}));

/* Send a GET request to /api/courses/:id to READ a course (including the user that 
owns the course) with a status code 200 */

router.get ('/courses/:id', asyncHandler ( async (req, res, next) => {
    const course = await Course.findByPk (req.params.id, { 
        include: [{
            model: User,
            as: 'teacher'
        }]
    }); 
    if (course) {
        res.json (course);
    } else {
        res.status (404).json ({ message: 'Course not found' });  
    }
}));

/* Send a POST request to /api/courses to CREATE a course, set the Location header to the 
URI for the course and return no content with a status code 201. */

router.post ('/courses', authenticateUser, asyncHandler ( async (req, res, next) => {
    
}));

/* Send a PUT request to /api/courses/:id to UPDATE a course with a status code 204 - the 
request has succeeded, but that the client doesn't need to go away from its current page). */

/* Send a DELETE request to /api/courses/:id to DELETE a course with a status code 204. */

module.exports = router;