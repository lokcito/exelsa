'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: DataTypes.STRING
  }, {});
  // User.associate = function(models) {
  //   User.hasMany(models.Address);
  //   // associations can be defined here
  // };
  return User;
};