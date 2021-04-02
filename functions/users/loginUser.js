const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Validator = require('validator');
const isEmpty = require('is-empty');

let conn = null;
const db_name = encodeURIComponent(process.env.DB_NAME);
const db_password = encodeURIComponent(process.env.DB_PASSWORD);
const db_user = process.env.DB_USER;

const URI = `mongodb+srv://${db_user}:${db_password}@cluster0.w5lai.mongodb.net/${db_name}?retryWrites=true&w=majority`;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }

}, {
  timestamps: true
});

UserSchema.methods.comparePasswords = async function (password) {
  let isMatch = await bcrypt.compare(password, this.password);
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
}

exports.handler = async function(event, context) {
  context.callbackWaitsForEmptyEventLoop = false;

  if (conn == null) {
    conn = mongoose.createConnection(URI, {
      bufferCommands: false, 
      bufferMaxEntries: 0,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    });
    await conn;
    conn.model('test-users', UserSchema)
  }

  async function login() {
    let User = conn.model('test-users');
    let secretOrKey = process.env.SECRET;
    try {
      validateLogin(JSON.parse(event?.body));
      const { email, password } = JSON.parse(event?.body);
      let user = await User.findOne({ email });
      if (!user) throw [{ msg: 'Email not found', id: 9 }];
      let matched = await user.comparePasswords(password);
      if (matched) {
        let token = jwt.sign({ id: user.id, name: user.name }, secretOrKey, { expiresIn: 31556926 });
        return {
          statusCode: 200,
          body: JSON.stringify({ success: true, token: `Bearer${token}` })
        }
      } else {
        throw [{ msg: 'Password isn\'t correct', id: 10 }];
      }
    } catch (errors) {
      return {
        statusCode: 400,
        body: JSON.stringify(errors)
      }
    }
  }
  return login()
  // return {
  //   statusCode: 200,
  //   body: 'Hola'
  // }
}