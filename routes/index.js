const router = require('express').Router()
const { checkLoginStatus } = require('../middleware')

router.get('/', checkLoginStatus, (req, res, next) => {
  res.status(200).render('index', { message: req.flash('info') })
})

module.exports = router
