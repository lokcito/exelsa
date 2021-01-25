'use strict';
module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define('Subject', {
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    code: DataTypes.STRING,
    image: DataTypes.STRING,
    link: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
   getterMethods: {

    },    
  });
  Subject.associate = function(models) {
    Subject.hasMany(models.Student);
    // associations can be defined here
  };  
  return Subject;
};
