const passport = require('passport')
const { User } = require('../models')
const user = require('../models/user')
const local = require('../passport/local')
const github = require('../passport/github')
const { logger } = require('../logger')

module.exports = () => {
  passport.serializeUser((user, done) => {
    console.log('🪀🪀🪀 github login 3')
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
}
