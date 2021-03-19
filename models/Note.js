const { Schema, model } = require('mongoose');

const NoteSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: [{
    type: { type: String, required: true },
    children: [{
      text: { type: String, required: true },
      bold: Boolean,
      underline: Boolean,
      italic: Boolean
    }]
  }],
  author: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// { type: 'paragraph', children: [ { text: 'wesvd' } ] }

module.exports = model('notes', NoteSchema);