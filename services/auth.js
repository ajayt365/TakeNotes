const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../modules/user/user.model')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.jwtSecret,
}
//Local Strategy

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async function(email, password, done) {
      try {
        const user = await User.findOne({ email })
        if (!user) {
          return done(null, false)
          //   res.status(404).send(`User doesn't exist`)
        }
        if (await user.validateUser(password)) {
          return done(null, user)
        } else {
          return done(null, false)
        }
      } catch (error) {
        return done(error)
      }
    }
  )
)

// JwtStrategy
passport.use(
  new JwtStrategy(jwtOpts, async (token, done) => {
    try {
      // console.log('token', token)
      const user = await User.findOne({ email: token.email })
      if (!user) {
        return done(null, false)
      }
      return done(null, user)
    } catch (error) {
      done(error, false)
    }
  })
)

const localAuth = passport.authenticate('local', { session: false })
const JWtAuth = passport.authenticate('jwt', { session: false })

module.exports = {
  localAuth,
  JWtAuth,
}
