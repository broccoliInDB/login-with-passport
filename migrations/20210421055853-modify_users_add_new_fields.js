'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('users', 'provider', {
        type: Sequelize.STRING(30),
        allowNull: true
      }),
      queryInterface.addColumn('users', 'githubId', {
        type: Sequelize.STRING(30),
        allowNull: true
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'provider'),
      queryInterface.removeColumn('users', 'githubId')
    ])
  }
}
