const passport = require('passport')
const { User } = require('../models')
const user = require('../models/user')
const local = require('./local')
const github = require('./github')
const google = require('./google')
const kakao = require('./kakao')
const facebook = require('./facebook')
const { logger } = require('../logger')

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log('🪀🪀🪀 login 3', user)
    return done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      console.log('🪀🪀🪀 deserializeUser')
      const user = await User.findOne({
        where: { id }
      })
      return done(null, user)
    } catch (error) {
      if (error) {
        logger.error(error)
        return done(error, false)
      }
    }
  })
  local()
  github()
  google()
  kakao()
  facebook()
}
