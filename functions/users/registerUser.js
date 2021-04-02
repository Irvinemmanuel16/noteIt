const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

UserSchema.methods.encryptPassword = async password => {
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
      // autoIndex: false
      useCreateIndex: true
    });
    await conn;
    conn.model('test-users', UserSchema)
  }

  async function register() {
    let User = conn.model('test-users');
    try {
      validateRegister(JSON.parse(event?.body));
      const { name, email, password } = JSON.parse(event?.body);
      let userEmail = await User.findOne({ email });
      if (userEmail) throw [{ msg: 'Email already exists', id: 8 }];
      let newUser = new User({ name, email });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      return {
        statusCode: 200,
        body: 'User registered succesfully'
      }
    } catch (errors) {
      return {
        statusCode: 400,
        body: JSON.stringify(errors)
      }
    }
  }

  return register()
}