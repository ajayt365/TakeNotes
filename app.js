const express = require('express')
const app = express()
const helmet = require('helmet')
const passport = require('passport')
const port = process.env.PORT || 3004

//database
require('dotenv').config()
require('./config/database')

// routers
const { userRouter } = require('./modules/user/user.routes')
const { noteRouter } = require('./modules/notes/notes.routes')

//middlewares
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(passport.initialize())

//registered routes
app.use('/api/user', userRouter)
app.use('/api/notes', noteRouter)

// error handling
app.use((err, req, res, next) => {
  console.error(err)
  res.json({ err: err.message })
})

// For unregistered routes
app.use((req, res, next) => {
  res.status(404).send('Not Found')
})

app.listen(port, () => {
  console.log('server up and running')
})
