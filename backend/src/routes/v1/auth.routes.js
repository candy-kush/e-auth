const express = require("express");
const { authController } = require('../../controllers');
const { jwtAuth, loginValidation, validate } = require("../../middlewares");
const router = express.Router();

router.route("/google/callback").get(authController.googleCallback);
router.route("/refresh-token").get(authController.refreshToken);

router.route("/otp/email/send").get(authController.sendEmailOtp);
router.route("/otp/email/verify").get(authController.verifyEmailOtp);

router.route("/register").post(authController.register);
router.route("/login").post(validate(loginValidation), authController.login);
router.route("/logout/:userId").get(authController.logout);

module.exports = router;
