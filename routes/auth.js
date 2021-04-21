const router = require('express').Router()
const passport = require('passport')
const { logger } = require('../logger')

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      logger.error(err)
      return next(err)
    }
    if (!user) {
      logger.info(info.message)
      req.flash('info', info.message)
      return res.status(401).redirect('/')
    }
    req.login(user, (err) => {
      if (err) {
        logger.error(err)
        next(err)
      }
      logger.info('reqlogin', user)
      logger.info('로그인마지막단계', req.session)
      req.session.save((err) => {
        if (err) {
          logger.error(err)
          next(err)
        } else {
          res.status(200).redirect(`/user/${user.id}`)
        }
      })
    })
  })(req, res, next)
})

router.get('/logout', (req, res, next) => {
  // req.session.destroy((err) => {
  //   if (err) {
  //     logger.error(err)
  //   }
  //   res.status(200).redirect('/')
  // })
  // passport에서는 아래와 같이 처리해주면 위와 동일하다.
  req.logout()
  req.session.save((err) => {
    if (err) {
      logger.error(err)
      return next(err)
    } else {
      return res.redirect('/')
    }
  })
})

router.get('/github', (req, res, next) => {
  console.log('🪀🪀🪀 github login 1')
  passport.authenticate('github', {
    scope: ['user:email']
  })(req, res, next)
})

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/' }),

  (req, res, next) => {
    console.log('🪀🪀🪀 github login 4')
    res.redirect(`/user/${req.user.id}`)
  }
)

module.exports = router
