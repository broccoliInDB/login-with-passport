const passport = require('passport')
const { User } = require('../models')
const user = require('../models/user')
const local = require('../passport/local')
const { logger } = require('../logger')

module.exports = () => {
  passport.serializeUser((user, done) => {
    logger.info('🏊‍♀️🏊‍♀️🏊‍♀️ serialize', user)
    return done(null, user.id)
  })
  passport.deserializeUser(async (id, done) => {
    try {
      logger.info('🥊🥊🥊 deserialize', id)
      const user = await User.findOne({
        where: { id: id }
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
}
