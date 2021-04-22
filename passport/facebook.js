const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const { User } = require('../models')
const { HOME_URL } = require('../config/environments')
require('dotenv').config()

module.exports = () => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FB_CLIENT_ID,
        clientSecret: process.env.FB_CLIENT_SECRET,
        callbackURL: `${HOME_URL}/auth/facebook/callback`
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('facebook로그인', profile)
      }
    )
  )
}
