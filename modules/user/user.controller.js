const Joi = require('joi')
const validations = require('../../services/validations')
const User = require('./user.model')
const jwt = require('jsonwebtoken')

async function signup(req, res) {
  try {
    const { error } = Joi.validate(req.body, validations.signupJoiSchema)
    console.log('body', req.body)
    if (error) {
      res.status(422).json({
        message: error.details[0].message,
        data: req.body,
      })
    } else {
      const user = await User.create(req.body)
      console.log(user)
      res.status(201).json(user)
    }
  } catch (err) {
    res.status(502).json({ err: err.message })
  }
}

async function login(req, res) {
  const { _id, email } = req.user
  const token = jwt.sign(
    {
      _id,
      email,
    },
    process.env.jwtSecret
  )
  const resObj = {
    _id,
    email,
    username: req.user.username,
    token: `bearer ${token}`,
  }
  res.status(201).json(resObj)
}

module.exports = {
  signup,
  login,
}
