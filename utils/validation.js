const Validator = require('validator');
const isEmpty = require('is-empty');

function validateLogin({ email, password }) {
  let errors = [];

  email = !isEmpty(email) ? email : '';
  password = !isEmpty(password) ? password : '';

  if (Validator.isEmpty(email)) errors.push({ msg: 'Email field is required', id: 2});
  if (!Validator.isEmail(email)) errors.push({ msg: 'Email is invalid', id: 3});
  if (Validator.isEmpty(password)) errors.push({ msg: 'Password field is required', id: 4});

  if (!isEmpty(errors)) throw errors;
}

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

module.exports = { validateLogin, validateRegister };