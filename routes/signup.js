const bcrypt = require('bcrypt')
const router = require('express').Router()
const { User } = require('../models')
const { logger } = require('../logger')
const { nanoid } = require('nanoid')
require('dotenv').config()

router.get('/', (req, res, next) => {
  res.status(200).render('signup', { message: req.flash('info') })
})

router.post('/', async (req, res, next) => {
  try {
    const { email, password, nickname } = req.body
    const user = await User.findOne({
      where: { email }
    })
    const hashedPasword = await bcrypt.hash(
      password,
      parseInt(process.env.SALTROUNDS, 10)
    )
    if (user) {
      req.flash('info', '이미 있는 사용자 입니다. 다른 이메일로 가입해 주세요')
      res.status(401).redirect('/signup')
    }
    const createdUser = await User.create({
      email,
      password: hashedPasword,
      nickname
    })
    logger.info('createdUser', createdUser)
    req.login(createdUser, (err) => {
      if (err) {
        logger.info(err)
        next(err)
      }
      req.session.save((err) => {
        if (err) {
          logger.error(err)
          next(err)
        } else {
          res.status(200).redirect(`/user/${createdUser.id}`)
        }
      })
    })
  } catch (error) {
    if (error) {
      logger.error(error)
      next(error)
    }
  }
})
module.exports = router
