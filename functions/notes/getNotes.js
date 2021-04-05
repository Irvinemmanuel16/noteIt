const mongoose = require('mongoose');


let conn = null;
const db_name = encodeURIComponent(process.env.DB_NAME);
const db_password = encodeURIComponent(process.env.DB_PASSWORD);
const db_user = process.env.DB_USER;

// const URI = `mongodb+srv://${db_user}:${db_password}@cluster0.w5lai.mongodb.net/${db_name}?retryWrites=true&w=majority`;
const URI = `mongodb+srv://admin_1:165IyY7radRG1Rd5@cluster0.w5lai.mongodb.net/noteIt?retryWrites=true&w=majority`;

exports.handler = async function(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;
  
  let noteSchema = new mongoose.Schema({
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
  })

  if (conn == null) {
    conn = mongoose.createConnection(URI, {
      bufferCommands: false, 
      bufferMaxEntries: 0,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      autoIndex: false
    });
    await conn;
    // conn.model('test', noteSchema)
  }
  // let Note = mongoose.model('test', noteSchema);
  // let notes = await Note.find()
  // mongoose.connection.close()
  console.log(db_password)
  return {
    statusCode: 200,
    body: JSON.stringify(notes)
  }
}