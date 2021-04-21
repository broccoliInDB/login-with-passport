const router = require('express').Router()
const { checkLoginStatus } = require('../middleware')

router.get('/', checkLoginStatus, (req, res, next) => {
  console.log('🪀🪀🪀 github login 6')
  res.status(200).render('index', { message: req.flash('info') })
})

module.exports = router
