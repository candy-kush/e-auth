module.exports.jwtAuth = require('./auth.middleware').jwtAuth;
module.exports.requestRateLimiter = require('./auth.middleware').requestRateLimiter;
module.exports.loginValidation = require('./body-validation.middleware').loginValidation;
module.exports.requestSanitizer = require('./request-sanitizer.middleware').requestSanitizer;
module.exports.validate = require('./validateSchema.middleware').validate;