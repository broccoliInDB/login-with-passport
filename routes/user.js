const router = require('express').Router()
const { User } = require('../models')
const { isLogged } = require('../middleware')
const bcrypt = require('bcrypt')
const { logger } = require('../logger')
require('dotenv').config()

router.get('/', (req, res, next) => {
  res.status(200).redirect('/')
})

router.post('/changepw', async (req, res, next) => {
  const { password1, password2 } = req.body
  if (password1 !== password2) {
    //비밀번호 동일하지 않은
    req.flash('info', ' 변경할 비밀번호가 동일하지 않습니다.')
    return res.status(401).redirect('/')
  } else {
    const { id } = req.user
    try {
      const user = await User.findOne({
        where: { id }
      })
      if (!user) return res.status(401).redirect('/')
      const hashedPassword = await bcrypt.hash(
        password1,
        parseInt(process.env.SALTROUNDS, 10)
      )
      await User.update({ password: hashedPassword }, { where: { id } })
      req.flash('info', '비밀번호가 변경되었습니다.')
      return res.status(200).redirect('/')
    } catch (error) {
      if (error) {
        logger.error(error)
        next(error)
      }
    }
  }
})

router.get('/:id', isLogged, async (req, res, next) => {
  try {
    logger.info('로그인성공시 로컬변수', res.locals)
    res.status(200).render('user')
  } catch (error) {
    if (error) {
      logger.error(error)
      next(error)
    }
  }
})

module.exports = router
