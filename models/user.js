'use strict'; 

const Sequelize = require ('sequelize'); 

module.exports = (sequelize) => {

    class User extends Sequelize.Model {}
    
    // Define a new table in the database with the name 'User'
    User.init ({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please provide a value for "First Name"' 
                } 
            }
        },
        lastName: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please provide a value for "Last Name"'
                }
            }
        },
        emailAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please provide a value for "Email Address"' 
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please provide a value for "Password"' 
                }
            }
        }
    }, { sequelize });

    // Define the relationship between courses and users adding a one-to-many association to the User model
    User.associate = (models) => {
        User.hasMany (models.Course, {
            as: 'teacher',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false  
            }
        });
    };

    return User; 
};