const mongoose = require('mongoose');

let conn = null;
const uri = 'mongodb+srv://admin_1:l0BkoV6ZcIGQQjFF@cluster0.w5lai.mongodb.net/notes-test?retryWrites=true&w=majority';

exports.handler = async function(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  if (conn == null) {
    conn = mongoose.connect(uri, {
      bufferCommands: false, 
      bufferMaxEntries: 0,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      autoIndex: false
    });
    await conn;
  }
  
  return conn.then(async () => {
    let Note = mongoose.model('test', new mongoose.Schema({ name: String }))
    let { name } = JSON.parse(event?.body);
    let newNote = new Note({ name })
    await newNote.save()
    mongoose.connection.close()
    return {
      statusCode: 200,
      body: JSON.stringify(newNote)
    }
  })
};
