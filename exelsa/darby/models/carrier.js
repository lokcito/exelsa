'use strict';
module.exports = (sequelize, DataTypes) => {
  const Carrier = sequelize.define('Carrier', {
    name: DataTypes.STRING
  }, {});
  return Carrier;
};