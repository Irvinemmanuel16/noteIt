const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const Validator = require('validator');
const isEmpty = require('is-empty');

const db_name = encodeURIComponent(process.env.DB_NAME);
const db_password = encodeURIComponent(process.env.DB_PASSWORD);
const db_user = process.env.DB_USER;

const URI = `mongodb+srv://${db_user}:${db_password}@cluster0.w5lai.mongodb.net/${db_name}?retryWrites=true&w=majority`;

let cachedDb = null;

async function encryptPassword(password) {
  let salt = await bcrypt.genSalt(10);
  let hash = await bcrypt.hash(password, salt);
  return hash;
};

function validateRegister({ name, email, password, password2 }) {
  let errors = [];

  name = !isEmpty(name) ? name : '';
  email = !isEmpty(email) ? email : '';
  password = !isEmpty(password) ? password : '';
  password2 = !isEmpty(password2) ? password2 : '';

  if (Validator.isEmpty(name)) errors.push({ msg: 'Name field is required', id: 1 });
  if (Validator.isEmpty(email)) errors.push({ msg: 'Email field is required', id: 2});
  if (!Validator.isEmail(email)) errors.push({ msg: 'Email is invalid', id: 3});
  if (Validator.isEmpty(password)) errors.push({ msg: 'Password field is required', id: 4});
  if (Validator.isEmpty(password2)) errors.push({ msg: 'Confirm password field is required', id: 5});
  if (!Validator.isLength(password, { min: 6, max: 30 })) errors.push({ msg: 'Password must be at least 6 characters', id: 6});
  if (!Validator.equals(password, password2)) errors.push({ msg: 'Passwords must match', id: 7});
  if (!isEmpty(errors)) throw errors;

  return { name, email, password }
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

async function registerUser(data) {
  let { db, client } = await connectToDatabase()
  try {
    const { name, email, password } = validateRegister(JSON.parse(data));
    let user = await db.collection('users').findOne({ email })
    if (user) throw [{ msg: 'Email already exists', id: 8 }];
    let encryptedPassword = await encryptPassword(password)
    await db
      .collection('users')
      .insertOne({ name, email, password: encryptedPassword })
  } catch (err) {
      return err
  } finally {
    await client.close();
  }
}

exports.handler = async function(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  try {   
    let errors = await registerUser(event.body)
    if(errors) throw errors
    return {
      statusCode: 200,
      body: 'User registered succesfully'
    }
  } catch (errors) {
    // console.log(errors)
    return {
      statusCode: 400,
      body: JSON.stringify(errors)
    }
  }
}