const passport = require("passport");
const httpStatus = require("http-status");
const rateLimit = require('express-rate-limit');
const { AppError } = require("../utils");
const { redisClient } = require("../configs");
const jwt = require('jsonwebtoken');
require('../configs/passport.config');

const verifyCallback = (req, resolve, reject) => async (err, user, info) => {
  if (err || info || !user) {
    return reject(new AppError(httpStatus.status.UNAUTHORIZED, "Please authenticate"));
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return reject(new AppError(httpStatus.status.UNAUTHORIZED, "Please authenticate"));
  }
  
  try {
    const token = authHeader.split(' ')[1];    
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const redisKey = `token:${payload.sub.id}:session:${payload.sub.sessionId}:ACCESS`;
    const storedToken = await redisClient.get(redisKey);

    if (!storedToken || storedToken !== token) {
      return reject(new AppError(httpStatus.status.FORBIDDEN, 'Session invalid or expired'));
    }

    req.user = user || payload.sub;
    return resolve();

  } catch (err) {
    return reject(new AppError(httpStatus.status.UNAUTHORIZED, "Invalid or expired token"));
  }
};

const jwtAuth = () => async (req, res, next) => {
  new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: true }, verifyCallback(req, resolve, reject))(req, res, next);
  })
  .then(() => next())
  .catch((err) => next(err));
};

const requestRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    res.status(429).json({
      message: 'Too many requests, please try again later.',
    });
  },
});

module.exports = {
  jwtAuth,
  requestRateLimiter,
};
