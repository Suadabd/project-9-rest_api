'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    // Attributes object
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
      
    }, 
    lastName: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
    emailAddress: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    }
  }, {
   
    sequelize, // pass connection instance
    modelName: 'User', // chosen modal name
  });

   // Other model options go here
   User.associate = (models) => {
    User.hasMany(models.Course, { 
      foreignkey: {
        fieldname: 'userId',
        allowNull: false,
      },
    });
    };
    
  return User;
};