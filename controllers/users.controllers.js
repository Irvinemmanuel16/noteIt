const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validateRegister, validateLogin } = require('../utils/validation');
const { secretOrKey } = require('../config');
const usersCtrl = {};

usersCtrl.loginUser = async (req, res) => {
  try {
    validateLogin(req.body);
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) throw { email: 'Email not found' };
    let matched = await user.comparePasswords(password);
    if (matched) {
      jwt.sign({ id: user.id, name: user.name }, secretOrKey, { expiresIn: 31556926 }, (error, token) => {
        return res.json({ success: true, token: 'Bearer' + token });
      });
    } else {
      throw { password: 'Password isn\'t correct' };
    }
  } catch (errors) {
    return res.status(400).json(errors);
  }
};

usersCtrl.registerUser = async (req, res) => {
  try {
    validateRegister(req.body);
    const { name, email, password } = req.body;
    let userEmail = await User.findOne({ email });
    if (userEmail) throw { email: 'Email already exists' };
    let newUser = new User({ name, email });
    newUser.password = await newUser.encryptPassword(password);
    await newUser.save();
    return res.send('User registered succesfully');
  } catch (errors) {
    return res.status(400).json(errors);
  }
};

module.exports = usersCtrl;