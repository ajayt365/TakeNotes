const User = require('../user/user.model')
const Note = require('./notes.model')
const Joi = require('joi')
const { notesJoiSchema } = require('../../services/validations')
const mongoose = require('mongoose')

async function createNote(req, res) {
  try {
    const { error } = Joi.validate(req.body, notesJoiSchema)
    if (error) {
      res.status(422).json({
        message: error.details[0].message,
        data: req.body,
      })
    } else {
      const note = await Note.create(req.body)
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { $push: { notes: note._id } },
        { new: true }
      )
      res.json(user)
    }
  } catch (error) {
    res.json({ error: error.message })
  }
}

async function updateNote(req, res) {
  try {
    const { noteId } = req.params
    const id = mongoose.Types.ObjectId(noteId)

    const user = await User.find({
      notes: { $in: [id] },
    })

    if (!!user[0]) {
      const note = await Note.findById(noteId)
      Object.keys(req.body).forEach(key => {
        note[key] = req.body[key]
      })
      const editedNote = await note.save()
      res.status(200).json(editedNote)
    } else {
      res.status(504).send('Something not working')
    }
  } catch (error) {
    res.status(501).json({ error: error.message })
  }
}

async function deleteNote(req, res) {
  try {
    const { noteId } = req.params
    const id = mongoose.Types.ObjectId(noteId)

    const user = await User.find({
      notes: { $in: [id] },
    })
    console.log(user)
    if (!!user[0]) {
      await Note.findByIdAndDelete(req.params.noteId)
      const user = await User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { notes: { $in: id } },
        },
        { new: true }
      )
      res.status(200).json(user)
    } else {
      res.status(401).send('No Id found')
    }
  } catch (error) {
    res.json({ error: error.message })
  }
}

async function getList(req, res) {
  try {
    const notes = await User.findById(req.user._id)
      .select('notes')
      .populate('notes')
      .lean()
      .exec()
    res.status(200).json(notes)
  } catch (error) {
    res.json({ error: error.message })
  }
}

module.exports = {
  createNote,
  getList,
  updateNote,
  deleteNote,
}
