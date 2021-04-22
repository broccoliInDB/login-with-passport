const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const passport = require('passport')
const FileStore = require('session-file-store')(session)
const flash = require('connect-flash')
const morgan = require('morgan')
const redis = require('redis')
const RedisStore = require('connect-redis')(session)
const passportConfig = require('./passport')
const indexRouter = require('./routes')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')
const signupRouter = require('./routes/signup')
const deleteRouter = require('./routes/delete')
const db = require('./models')
const helmet = require('helmet')
const hpp = require('hpp')
const { logger } = require('./logger')
require('dotenv').config()
passportConfig()

db.sequelize
  .sync()
  .then(() => {
    logger.info('🥎🥎 db 연결성공')
  })
  .catch((e) => {
    logger.error(e)
  })

const app = express()

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, './views'))

if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'))
  app.use(helmet())
  app.use(hpp())
} else {
  app.use(morgan('dev'))
}
//parse json body : bodyparser
app.use(express.json())
// url encoded body
app.use(express.urlencoded({ extended: false }))
if (process.env.NODE_ENV === 'production') {
  const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_POST,
    password: process.env.REDIS_PASSWORD,
    logErrors: true
  })
  const sessionProdOption = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    proxy: true,
    cookie: {
      secure: true,
      maxAge: 60 * 1 * 1 * 1,
      httpOnly: true
      // secure: true
    },
    store: new RedisStore({ client })
  }
  app.use(session(sessionProdOption))
} else {
  const sessionDevOption = {
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
  }
  app.use(session(sessionDevOption))
}
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter)
app.use('/signup', signupRouter)
app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/delete', deleteRouter)
app.get('*', (req, res, next) => {
  res.status(404).send('404 page not found')
})
app.use((err, req, res, next) => {
  if (err) {
    logger.error(err)
    res.status(500).send('something broken')
  }
})

app.listen(process.env.PORT, () => {
  logger.info(`server on ${process.env.PORT}`)
})
