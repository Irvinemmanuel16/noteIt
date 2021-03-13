const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');
const { secretOrKey } = require('../config');

const opts = { secretOrKey };

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

module.exports = passport => {
  passport.use(new JwtStrategy(opts, async (jwtPayload, done) => {
    try {
      let user = await User.findById(jwtPayload.id);
      if (user) return done(null, user);
      return done(null, false);
    } catch (error) {
      console.error(error);
    }
  }));
};
