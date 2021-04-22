'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('users', 'kakaoId', {
        type: Sequelize.STRING(30),
        allowNull: true
      }),
      queryInterface.addColumn('users', 'facebookId', {
        type: Sequelize.STRING(30),
        allowNull: true
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'kakaoId'),
      queryInterface.removeColumn('users', 'facebookId')
    ])
  }
}
