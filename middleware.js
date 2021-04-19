const { logger } = require('./logger')

module.exports = {
  checkLoginStatus: (req, res, next) => {
    logger.info('checkLoginStatus', req.user)
    if (req.user) {
      const { nickname, id } = req.user
      res.locals.isLogged = true
      res.locals.nickname = nickname
      res.locals.id = id
      next()
    } else {
      res.locals.isLogged = false
      next()
    }
  },
  isLogged: (req, res, next) => {
    if (req.user) {
      const { nickname, id } = req.user
      res.locals.isLogged = true
      res.locals.nickname = nickname
      res.locals.id = id
      next()
    } else {
      res.status(401).redirect('/')
    }
  }

  // isNotLogged: (req, res, next) => {
  //   if (!req.isAuthenticated()) {
  //     next()
  //   } else {
  //     res.status(401).
  //   }
  // }
}
