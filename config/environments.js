require('dotenv').config()

module.exports = {
  HOME_URL:
    process.env.NODE_ENV === 'production'
      ? 'https://login-with-passport.herokuapp.com'
      : 'http://localhost:3065'
}
