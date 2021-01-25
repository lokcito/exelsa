'use strict';
module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    level: DataTypes.INTEGER,
    SchoolId: DataTypes.INTEGER,
    SubjectId: DataTypes.INTEGER,
  }, {
    getterMethods: {
      getShortname() {
        var lastName = this.lastName || "-";
        var firstName = this.firstName || "-";
        return firstName + ' ' + lastName.substring(0, 1);
      },
      getFullname() {
        var lastName = this.lastName || "-";
        var firstName = this.firstName || "-";
        return firstName + ' ' + lastName;
      }
    },
  });
  Student.associate = function(models) {
    // associations can be defined here
    Student.belongsTo(models.School, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  Student.associate = function(models) {
    // associations can be defined here
    Student.belongsTo(models.Subject, {
      foreignKey: {
        allowNull: false
      }
    });
  };
  return Student;
};