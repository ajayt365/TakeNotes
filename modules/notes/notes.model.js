const mongoose = require('mongoose')
const slug = require('slug')
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
      required: [true, 'Please enter Title'],
      trim: true,
    },
    text: {
      type: String,
      required: [true, `Note can't be empty`],
      minlength: [10, 'Text needs to be longer'],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
)
noteSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    var retJson = {
      _id: ret._id,
      title: ret.title,
      text: ret.text,
      slug: ret.slug,
      created: ret.createdAt,
    }
    return retJson
  },
})
noteSchema.pre('save', function(next) {
  this.slug = slug(this.title)
  return next()
})

const Note = mongoose.model('note', noteSchema)
module.exports = Note
