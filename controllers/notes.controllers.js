const Note = require('../models/Note');
let notesCtrl = {};

notesCtrl.getNotes = async (req, res) => {
  let notes = await Note.find();
  res.json(notes);
};

notesCtrl.createNote = async (req, res) => {
  let { title, author, content } = req.body;
  let newNote = new Note({ title, author, content });
  let { _id: id } = await newNote.save();
  res.send(id);
};

notesCtrl.getNote = async (req, res) => {
  let { id } = req.params;
  let note = await Note.findById(id);
  res.json(note);
};

notesCtrl.editNote = async (req, res) => {
  let { title, content } = req.body;
  let { id } = req.params;
  await Note.findByIdAndUpdate(id, { title, content });
  res.send(id);
};

notesCtrl.deleteNote = async (req, res) => {
  let { id } = req.params;
  await Note.findByIdAndDelete(id);
  res.send('Note deleted succesfully');
};

module.exports = notesCtrl;
