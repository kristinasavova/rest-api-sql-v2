# REST API

The API provides a way for users to administer a school database containing information about courses: users can interact with the database by retrieving a list of courses, as well as adding, updating and deleting courses in the database.

In addition, the project requires users to create an account and log-in to be able to make changes to the database.

Knowledge of REST API design, Node.js, and Express are used to create API routes, along with the Sequelize ORM for data modeling, validation, and persistence. The application is tested using Postman.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

In order to install the required dependencies you need to run:
```
npm install
```
To create your application's database and populate it with data run the command: 
```
npm run seed
```
After the command completes, you'll find in the project's root folder a SQLite database file named `fsjstd-restapi.db`. To launch the application, run the command: 
```
npm start
```  

## Built With

* Node.js
* Express
* Sequelize ORM
* Postman

## Acknowledgments

* Treehouse teachers and moderators. 
