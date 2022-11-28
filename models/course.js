'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Course.init({
    // Attributes defined here for object/Model
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
      notNull: {
        msg: "A title is required",
      },
      notEmpty: {
        msg: "Please provide a title",
      },
    },
  }, 
    description: {
      type: DataTypes.TEXT,
      // allowNull defaults to true
      allowNull: false,
      validate: {
        notNull: {
          msg: "A description is required",
        },
        notEmpty: {
          msg: "Please provide a discription",
        },
      },
  }, 
    estimatedTime: {
      type: DataTypes.STRING,
  },
  materialsNeeded: {
      type: DataTypes.STRING,
  },
  }, {
    sequelize, // pass connection instance
    modelName: 'Course', // chosen modal name
  });

//   Course.associate = (models) => {
//     Course.belongsTo(models.User, { 
//       foreignkey: {
//         fieldname: 'userId',
//         allowNull: false,
//       },
//     });
//   };
//   return Course;
// };

      Course.associate = (models) => {
        Course.belongsTo(models.User, {
          as: "user", // alias for model association 
          foreignKey: {
            fieldName: "userId",
            allowNull: false,
          },
        });
      };
      return Course;
      };