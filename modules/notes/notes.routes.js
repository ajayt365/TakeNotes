const noteRouter = require('express').Router()
const noteController = require('./notes.controller')
const { JWtAuth } = require('../../services/auth')

noteRouter.post('/new', JWtAuth, noteController.createNote)
noteRouter.get('/', JWtAuth, noteController.getList)
noteRouter.post('/update/:noteId', JWtAuth, noteController.updateNote)
noteRouter.post('/delete/:noteId', JWtAuth, noteController.deleteNote)

module.exports = {
  noteRouter,
}
