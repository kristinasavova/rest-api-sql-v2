'use strict'; 

const Sequelize = require ('sequelize'); 

module.exports = (sequelize) => {

    class Course extends Sequelize.Model {}
    
    // Define a new table in the database with the name 'Course'
    Course.init ({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please provide a value for "Title"' 
                } 
            }
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: 'Please provide a value for "Description"'
                }
            }
        },
        estimatedTime: {
            type: Sequelize.STRING,
            allowNull: true
        },
        materialsNeeded: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, { sequelize });

    // Define the relationship between courses and users adding a one-to-one association to the Course model
    Course.associate = (models) => {
        Course.belongsTo (models.User, {
            as: 'teacher',
            foreignKey: {
                fieldName: 'userId',
                allowNull: false  
            }
        });
    };

    return Course; 
};