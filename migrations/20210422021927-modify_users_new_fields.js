'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    Promise.all([
      queryInterface.addColumn('users', 'googleId', {
        type: Sequelize.STRING(30),
        allowNull: true
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn('users', 'googleId')])
  }
}
