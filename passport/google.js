const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const { HOME_URL } = require('../config/environments')
const { User } = require('../models')
require('dotenv').config()

module.exports = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GG_CLIENT_ID,
        clientSecret: process.env.GG_CLIENT_SECRET,
        callbackURL: `${HOME_URL}/auth/google/callback`,
        passReqToCallback: true
      },
      async (req, assessToken, refreshToken, profile, done) => {
        try {
          const { id, displayName, emails } = profile
          const user = await User.findOne({
            where: { googleId: profile.id }
          })
          if (!user) {
            const foundEmail = emails.find((email) => email.verified === true)
            const existedUser = await User.findOne({
              where: { email: foundEmail.value }
            })
            if (existedUser) {
              await User.update(
                { googleId: id },
                { where: { email: foundEmail.value } }
              )
              return done(null, existedUser)
            } else {
              const createdUser = await User.create({
                googleId: id,
                email: foundEmail.value,
                nickname: displayName
              })
              return done(null, createdUser)
            }
          } else {
            return done(null, user)
          }
        } catch (error) {
          if (error) {
            console.error(error)
            done(error)
          }
        }
      }
    )
  )
}
