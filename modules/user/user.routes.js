const userRouter = require('express').Router()
const userController = require('./user.controller')
const { localAuth } = require('../../services/auth')
userRouter.post('/signup', userController.signup)
userRouter.post('/login', localAuth, userController.login)
module.exports = {
  userRouter,
}
