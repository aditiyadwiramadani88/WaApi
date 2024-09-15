'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
    }
  }
  User.init({
    fullName: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING, 
    role: DataTypes.ENUM("ADMIN", "USER"), 
    deviceLimit: DataTypes.INTEGER
  
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};