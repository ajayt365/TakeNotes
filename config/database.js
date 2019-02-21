const mongoose = require('mongoose')

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log(`Connection established`)
  })
  .catch(err => {
    console.error(err)
  })
