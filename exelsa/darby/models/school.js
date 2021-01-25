'use strict';
module.exports = (sequelize, DataTypes) => {
  const School = sequelize.define('School', {
    name: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
   getterMethods: {

    },    
  });
  School.associate = function(models) {
    School.hasMany(models.Student);
    // associations can be defined here
  };  
  return School;
};
