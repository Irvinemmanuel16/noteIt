const { MongoClient } = require('mongodb');

const db_name = encodeURIComponent(process.env.DB_NAME);
const db_password = encodeURIComponent(process.env.DB_PASSWORD);
const db_user = process.env.DB_USER;

const URI = `mongodb+srv://${db_user}:${db_password}@cluster0.w5lai.mongodb.net/${db_name}?retryWrites=true&w=majority`;

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && cachedDb.serverConfig.isConnected()) {
    return cachedDb;
  }
  const client = await new MongoClient.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  const db = await client.db('noteIt');
  cachedDb = db;
  return { db, client };
}

async function getNotes() {
  let { db, client } = await connectToDatabase()
  try {
    const notes = await db
      .collection('notes')
      .find()
      .toArray()
    return notes;
  } catch (err) {
    console.log(err);
  } finally {
    await client.close();
  }
}

exports.handler = async function(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;
  
  let notes = await getNotes()

  return {
    statusCode: 200,
    body: JSON.stringify(notes)
  }
}