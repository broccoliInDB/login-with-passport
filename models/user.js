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
        allowNull: true
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: true
      },
      provider: {
        type: DataTypes.STRING(30),
        allowNull: true
      },
      githubId: {
        type: DataTypes.STRING(30),
        allowNull: true
      },
      googleId: {
        type: DataTypes.STRING(30),
        allowNull: true
      },
      kakaoId: {
        type: DataTypes.STRING(30),
        allowNull: true
      },
      facebookId: {
        type: DataTypes.STRING(30),
        allowNull: true
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
