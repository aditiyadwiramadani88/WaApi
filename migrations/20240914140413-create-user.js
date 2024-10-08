'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fullName: {
        type: Sequelize.STRING, 
      },
      email: {
        type: Sequelize.STRING,
        unique: true 
      },
      role: {
        type: Sequelize.ENUM("ADMIN", 'USER'),
      },
      password: {
        type: Sequelize.STRING
      },
      deviceLimit:  { 
        type: Sequelize.INTEGER, 
        allowNull: true 
      }, 
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};