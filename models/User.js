const bcrypt = require('bcrypt');
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
// Create our User model
class User extends Model {
    // setup method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    };
};

// define table columns and configuration
User.init (
    {
        // TABLE COLUMN definiton goes here
        // define an id column
        id: {
            // use the special Sequelize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            // this is equivalent to SQL'S "NOT NULL" option
            allowNull: false,
            // intruct that this is primary key
            primaryKey: true,
            // turn on autoIncrement
            autoIncrement: true
        },

        // define username column
        username : {
            type: DataTypes.STRING,
            allowNull: false
        },

        // define email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be duplicate email in this table
            unique: true,
            // when allowNull is set to false, we can run our data thru validators
            validate:{
                isEmail: true
            }
        },

        //define password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means password needs to be four characters long 
                len:[4]
            }

        }
    },
  
    {
        hooks: {
            // setup beforeCreate lifecycle 'hook' funcitonality to execute the bcrypt hash function.
            async beforeCreate(newUserData) {
                newUserData.password = await bcrypt.hash(newUserData.password, 10)
                return newUserData;  
            } ,
            // setup beforeUpdate hook 
            async beforeUpdate (updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        // pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        // don't automatically create createdAt/updateAt timestamps fields
        timestamps: false,
        // don't pluralize name of database table
        freezTableName: true,
        // use underscores insted of camelCasing
        underscored: true,
        // make it so our model name stays lowercase in the database
        modelName:'user'
    }
);

module.exports = User;