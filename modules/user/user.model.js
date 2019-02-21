const mongoose = require('mongoose')
const validator = require('validator')
const regex = /^(?:[\w@]+){6,}$/
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Enter the username'],
      minlength: 3,
      maxlength: 30,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        msg: 'validation of `{PATH}` failed with value `{VALUE}`',
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: value => regex.test(value),
        msg: 'validation of `{PATH}` failed with value `{VALUE}`',
      },
    },

    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'note' }],
  },
  {
    timestamps: true,
  }
)

userSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    var retJson = {
      email: ret.email,
      name: ret.name,
      notes: ret.notes,
      created: ret.createdAt,
    }
    return retJson
  },
})

userSchema.methods = {
  validateUser: async function(password) {
    try {
      const response = await bcrypt.compare(password, this.password)
      return response
    } catch (error) {
      console.error('error', error)
    }
  },
}

userSchema.pre('save', async function(next) {
  try {
    console.log({ this: this })
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10)
    }
    next()
  } catch (error) {
    console.error(error)
  }
})

const User = mongoose.model('user', userSchema)

module.exports = User
