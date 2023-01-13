'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PackageDetails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      currency: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['usd', 'gbp', 'euro'],
      },
      amount: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      long_description: {
        allowNull: true,
        type: Sequelize.TEXT
      },
      access_link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      program_type: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      coach_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      package_type: {
        type: Sequelize.ENUM,
        values: ['basic', 'premium', 'elite'],
        defaultValue:'basic'
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
    await queryInterface.dropTable('PackageDetails');
  }
};