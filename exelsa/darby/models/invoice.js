'use strict';
module.exports = (sequelize, DataTypes) => {
  const Invoice = sequelize.define('Invoice', {
    code: DataTypes.STRING,
    paypalid: DataTypes.STRING,
  }, {});
  return Invoice;
};