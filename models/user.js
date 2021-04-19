module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'user',
    {
      email: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci'
    }
  )

  User.associate = (db) => {}
  return User
}
