const router = require('express').Router()
const { isLogged } = require('../middleware')
const { User } = require('../models')
const { logger } = require('../logger')

router.get('/', isLogged, async (req, res, next) => {
  const { id } = req.query
  try {
    await User.destroy({
      where: { id }
    })
    res.status(200).redirect('/')
  } catch (error) {
    if (error) {
      logger.error(error)
      next(error)
    }
  }
})

module.exports = router
