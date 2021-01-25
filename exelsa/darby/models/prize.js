'use strict';
module.exports = (sequelize, DataTypes) => {
  const Prize = sequelize.define('Prize', {
    school: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
   getterMethods: {

    },    
  });
  Prize.associate = function(models) {
    Prize.hasMany(models.Student);
    // associations can be defined here
  };  
  return Prize;
};
