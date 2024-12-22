'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'email', {
      type: Sequelize.STRING,
      allowNull: true, // Set to true if you allow null emails, or false if it's required
      unique: true, // Optionally set the email to be unique
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'email');
  }
};
