const Validator = require('validator');
const isEmpty = require('is-empty');

function validateLogin({ email, password }) {
  let errors = {};

  email = !isEmpty(email) ? email : '';
  password = !isEmpty(password) ? password : '';

  if (Validator.isEmpty(email)) errors.email = 'Email field is required';
  if (!Validator.isEmail(email)) errors.email = 'Email is invalid';
  if (Validator.isEmpty(password)) errors.password = 'Password field is required';

  if (!isEmpty(errors)) throw errors;
}

function validateRegister({ name, email, password, password2 }) {
  let errors = {};

  name = !isEmpty(name) ? name : '';
  email = !isEmpty(email) ? email : '';
  password = !isEmpty(password) ? password : '';
  password2 = !isEmpty(password2) ? password2 : '';

  if (Validator.isEmpty(name)) errors.name = 'Name field is required';
  if (Validator.isEmpty(email)) errors.email = 'Email field is required';
  if (!Validator.isEmail(email)) errors.email = 'Email is invalid';
  if (Validator.isEmpty(password)) errors.password = 'Password field is required';
  if (Validator.isEmpty(password2)) errors.password2 = 'Confirm password field is required';
  if (!Validator.isLength(password, { min: 6, max: 30 })) errors.password = 'Password must be at least 6 characters';
  if (!Validator.equals(password, password2)) errors.password2 = 'Passwords must match';

  if (!isEmpty(errors)) throw errors;
}

module.exports = { validateLogin, validateRegister };