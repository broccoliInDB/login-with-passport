const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { User } = require('../models')
const { compare } = require('bcrypt')

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            where: { email }
          })
          if (!user) {
            return done(null, false, { message: '해당사용자가 없습니다.' })
          }
          const result = await compare(password, user.password)
          if (result) {
            return done(null, user)
          }
          return done(null, false, { message: '사용자 정보가 잘못됐습니다.' })
        } catch (error) {
          if (error) {
            logger.error(error)
            done(error)
          }
        }
      }
    )
  )
}
