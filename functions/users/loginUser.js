const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Validator = require('validator');
const isEmpty = require('is-empty');

const db_name = encodeURIComponent(process.env.DB_NAME);
const db_password = encodeURIComponent(process.env.DB_PASSWORD);
const db_user = process.env.DB_USER;

const URI = `mongodb+srv://${db_user}:${db_password}@cluster0.w5lai.mongodb.net/${db_name}?retryWrites=true&w=majority`;

let cachedDb = null;


async function comparePasswords(password, savedPassword) {
  let isMatch = await bcrypt.compare(password, savedPassword);
  return isMatch;
};

function validateLogin({ email, password }) {
  let errors = [];

  email = !isEmpty(email) ? email : '';
  password = !isEmpty(password) ? password : '';

  if (Validator.isEmpty(email)) errors.push({ msg: 'Email field is required', id: 11});
  if (!Validator.isEmail(email)) errors.push({ msg: 'Email is invalid', id: 12});
  if (Validator.isEmpty(password)) errors.push({ msg: 'Password field is required', id: 13});

  if (!isEmpty(errors)) throw errors;

  return { email, password }
}

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

async function loginUser(data) {
  let { db, client } = await connectToDatabase()
  let secretOrKey = process.env.SECRET;
  try {
    const { email, password } = validateLogin(JSON.parse(data))
    let user = await db.collection('users').findOne({ email });
    if(!user) throw [{ msg: 'Email not found', id: 9 }];
    let matched = await comparePasswords(password, user.password)
    if (matched) {
      let token = jwt.sign({ id: user.id, name: user.name }, secretOrKey, { expiresIn: 31556926 });
      return token
    } else {
      throw [{ msg: 'Password isn\'t correct', id: 10 }];
    }
  } catch(error) {
      return error
  } finally {
    await client.close()
  }
}

exports.handler = async function(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  try {   
    let response = await loginUser(event.body)
    if(Array.isArray(response)) throw response

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, token: `Bearer${response}` })
    }
  } catch (errors) {
    return {
      statusCode: 400,
      body: JSON.stringify(errors)
    }
  }
}