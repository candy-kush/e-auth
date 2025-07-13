const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const passport = require('passport');
const { User } = require('../models');

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const jwtVerify = async (payload, done) => {
  try {
    const user = await User.findOne({ _id: payload.sub.id });
    if (!user) return done(null, false);
    done(null, user);
  } catch (err) {
    done(err, false);
  }
};

passport.use('jwt', new JwtStrategy(opts, jwtVerify));
