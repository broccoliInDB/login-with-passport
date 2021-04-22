const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const { User } = require('../models')
const { HOME_URL } = require('../config/environments')
require('dotenv').config()

/**
 facebook로그인 {
2021-04-22T04:26:44.016569+00:00 app[web.1]: id: '3743461675702395',
2021-04-22T04:26:44.016569+00:00 app[web.1]: username: undefined,
2021-04-22T04:26:44.016570+00:00 app[web.1]: displayName: 'Yongbum Choi',
2021-04-22T04:26:44.016570+00:00 app[web.1]: name: {
2021-04-22T04:26:44.016571+00:00 app[web.1]: familyName: undefined,
2021-04-22T04:26:44.016571+00:00 app[web.1]: givenName: undefined,
2021-04-22T04:26:44.016572+00:00 app[web.1]: middleName: undefined
2021-04-22T04:26:44.016572+00:00 app[web.1]: },
2021-04-22T04:26:44.016572+00:00 app[web.1]: gender: undefined,
2021-04-22T04:26:44.016573+00:00 app[web.1]: profileUrl: undefined,
2021-04-22T04:26:44.016573+00:00 app[web.1]: provider: 'facebook',
emails: [ { value: 'cyb1117@naver.com' } ], 
photos: [ { value: 'https://platform-lookaside.fbsbx.com/platform }]
_raw: '{"name":"Yongbum Choi","id":"3743461675702395"}',
_json: { name: 'Yongbum Choi', id: '3743461675702}
*/

module.exports = () => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FB_CLIENT_ID,
        clientSecret: process.env.FB_CLIENT_SECRET,
        callbackURL: `${HOME_URL}/auth/facebook/callback`,
        profileFields: ['id', 'displayName', 'photos', 'email']
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('@@@@@ facebook profile', profile)
        try {
          const {
            _json: { id, email, name }
          } = profile
          const user = await User.findOne({
            where: { facebookId: profile.id }
          })
          if (!user) {
            const existedUser = await User.findOne({
              where: { email }
            })
            if (existedUser) {
              await User.update(
                {
                  facebookId: id
                },
                {
                  where: { email }
                }
              )
              return done(null, existedUser)
            } else {
              const createdUser = await User.create({
                facebookId: profile.id,
                email,
                nickname: name
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
