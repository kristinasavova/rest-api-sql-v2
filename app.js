'use strict';

const express = require ('express');
const morgan = require ('morgan');
const { sequelize } = require ('./models'); // import Sequelize

// Variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

const app = express ();

// Setup morgan which gives us http request logging
app.use (morgan ('dev'));

// Setup your api routes 

// Setup a friendly greeting for the root route
app.get ('/', (req, res) => {
    res.json ({ message: 'Welcome to the REST API project!' });
});

// Send 404 if no other route matched
app.use ( (req, res) => {
    res.status (404).json ({ message: 'Route Not Found' });
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
        // Returns a promise that resolves to a successful, authenticated connection to the database
        await sequelize.authenticate ();
        console.log ('Connection to the database is successful!')
    })
    .then ( () => {
        // Start a server
        const server = app.listen (app.get ('port'), () => {
        console.log (`Express server is listening on port ${server.address ().port}`);
    })
});
