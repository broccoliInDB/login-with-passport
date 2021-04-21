'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.changeColumn('users', 'password', {
        type: Sequelize.STRING(100),
        allowNull: true
      }),
      queryInterface.changeColumn('users', 'nickname', {
        type: Sequelize.STRING(30),
        allowNull: true
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.changeColumn('users', 'password', {
        type: Sequelize.STRING(100),
        allowNull: false
      }),
      queryInterface.changeColumn('users', 'nickname', {
        type: Sequelize.STRING(30),
        allowNull: false
      })
    ])
  }
}
