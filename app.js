'use strict';

const express = require ('express');
const morgan = require ('morgan'); 
const { sequelize } = require ('./models'); // import Sequelize
const users = require ('./routes/users'); 
const courses = require ('./routes/courses');  

// Variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

const app = express ();

// Setup morgan which gives us http request logging
app.use (morgan ('dev'));

// Make it possible to access values on request body - body parser
app.use (express.json ());

// Setup your api routes 
app.use ('/api', users);
app.use ('/api', courses); 

// Setup a friendly greeting for the root route
app.get ('/', (req, res) => {
    res.json ({ message: 'Welcome to the REST API project!' });
});

// Send 404 if no other route matched
app.use ( (req, res, next) => {
    const err = new Error ('Not Found');
    err.status = 404;
    console.log ('Not Found', err);
    next (err); 
});

// Setup a global error handler
app.use ( (err, req, res, next) => {
    if (enableGlobalErrorLogging) {
        console.error (`Global error handler: ${JSON.stringify (err.stack)}`);
    }
    res.status (err.status || 500).json ({
        message: err.message,
        error: {},
    });
});

app.set ('port', process.env.PORT || 5000);

sequelize.sync () 
    .then ( async () => { 
        await sequelize.authenticate ();
        console.log ('Connection to the database is successful!')
    })
    .then ( () => {
        const server = app.listen (app.get ('port'), () => {
            console.log (`Express server is listening on port ${server.address ().port}`);
        });
    })
    .catch ( error => console.log ('There is an error connecting to the database or setting up a server', error));
