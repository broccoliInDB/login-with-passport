const passport = require('passport')
const GithubStrategy = require('passport-github2').Strategy
const { HOME_URL } = require('../config/environments')
const { User } = require('../models')
const fetch = require('node-fetch')

module.exports = () => {
  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GH_CLIENT_ID,
        clientSecret: process.env.GH_CLIENT_SECRET,
        callbackURL: `${HOME_URL}/auth/github/callback`
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log('🪀🪀🪀 github login 2')
          const {
            _json: { id, email },
            username
          } = profile
          const user = await User.findOne({
            where: { githubId: profile.id }
          })
          if (!user) {
            let foundEmail = null
            if (!email) {
              const emailData = await (
                await fetch('https://api.github.com/user/emails', {
                  headers: {
                    Authorization: `token ${accessToken}`
                  }
                })
              ).json()
              foundEmail = emailData.find(
                (email) => email.primary === true && email.verified === true
              )
            }

            const createdUser = await User.create({
              githubId: profile.id,
              email: email ? email : foundEmail.email,
              nickname: profile.username
            })
            return done(null, createdUser)
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
