const passport = require('passport')
const KakaoStrategy = require('passport-kakao').Strategy
const { HOME_URL } = require('../config/environments')
const { User } = require('../models')
require('dotenv').config()

module.exports = () => {
  console.log('kakao 전략')
  passport.use(
    new KakaoStrategy(
      {
        clientID: process.env.KO_CLIENT_ID,
        clientSecret: process.env.KO_CLIENT_SECRET,
        callbackURL: `${HOME_URL}/auth/kakao/callback`
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log('kakao로그인', accessToken, refreshToken, profile, done)
        try {
          const {
            id,
            displayName,
            _json: {
              kakao_account: { email }
            }
          } = profile
          const user = await User.findOne({
            where: { kakaoId: id }
          })
          if (!user) {
            const existedUser = await User.findOne({
              where: { email }
            })
            if (existedUser) {
              await User.update({ kakaoId: id }, { where: { email } })
              return done(null, existedUser)
            } else {
              const createdUser = await User.create({
                kakaoId: id,
                email,
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
