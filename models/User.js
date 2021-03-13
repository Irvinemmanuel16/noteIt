const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
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

UserSchema.methods.encryptPassword = async password => {
  let salt = await bcrypt.genSalt(10);
  let hash = await bcrypt.hash(password, salt);
  return hash;
};

module.exports = model('users', UserSchema);