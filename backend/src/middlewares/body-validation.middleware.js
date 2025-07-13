const Joi = require('joi');

const loginValidation = {
  body: Joi.object().keys({
    email: Joi.string().messages({
      'string.empty': 'email cannot be empty',
    }),
    password: Joi.string().messages({
      'string.empty': 'password cannot be empty',
    }),
  })
};


module.exports = {
  loginValidation
};