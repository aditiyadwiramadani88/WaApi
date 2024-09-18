'use strict';
const hashPassword = require('../utils/helper');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.bulkInsert('Users', [{
        fullName:"Admin Example", 
        email: "admin@mail.com", 
        role: "ADMIN", 
        password: hashPassword("12345678")
      }]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
