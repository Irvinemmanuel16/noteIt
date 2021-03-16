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
    if (!user) throw [{ msg: 'Email not found', id: 9 }];
    let matched = await user.comparePasswords(password);
    if (matched) {
      jwt.sign({ id: user.id, name: user.name }, secretOrKey, { expiresIn: 31556926 }, (error, token) => {
        return res.json({ success: true, token: 'Bearer' + token });
      });
    } else {
      throw { password: 'Password isn\'t correct' };
    }
  } catch (errors) {
    return res.status(400).send(errors);
  }
};

usersCtrl.registerUser = async (req, res) => {
  try {
    validateRegister(req.body);
    const { name, email, password } = req.body;
    let userEmail = await User.findOne({ email });
    if (userEmail) throw [{ msg: 'Email already exists', id: 8 }];
    let newUser = new User({ name, email });
    newUser.password = await newUser.encryptPassword(password);
    await newUser.save();
    return res.send('User registered succesfully');
  } catch (errors) {
    return res.status(400).send(errors);
  }
};

module.exports = usersCtrl;