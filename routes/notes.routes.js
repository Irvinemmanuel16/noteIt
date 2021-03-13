const router = require('express').Router();
const { getNotes, createNote, getNote, editNote, deleteNote } = require('../controllers/notes.controllers');

router.get('/', getNotes);

router.get('/:id', getNote);

router.post('/create', createNote);

router.put('/edit/:id', editNote);

router.delete('/delete/:id', deleteNote);


module.exports = router;