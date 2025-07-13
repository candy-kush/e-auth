const httpStatus = require("http-status");
const { authService } = require("../services/index");

const refreshToken = async (req, res) => {
  try {
    const response = await authService.refreshToken(req);
    res.status(httpStatus.status.OK).send(response);
  } catch (error) {
    res.status(error.statusCode).send({ code: error.statusCode, message: error.message });
  }
};

const googleCallback = async (req, res) => {
  try {
    const response = await authService.googleCallback(req);
    res.redirect(`http://127.0.0.1:5500/webpage/html/google-redirection.html?token=${response.token}&secret=${response.secret}&key=${response.key}&next=${response.next}`);
  } catch (error) {
    res.status(error.statusCode).send({ code: error.statusCode, message: error.message });
  }
};

const register = async (req, res) => {
  try {
    const response = await authService.register(req);
    res.status(httpStatus.status.OK).send(response);
  } catch (error) {
    res.status(error.statusCode).send({ code: error.statusCode, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const response = await authService.login(req);
    res.status(httpStatus.status.OK).send(response);
  } catch (error) {
    res.status(error.statusCode).send({ code: error.statusCode, message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const response = await authService.logout(req);
    res.status(httpStatus.status.OK).send(response);
  } catch (error) {
    res.status(error.statusCode).send({ code: error.statusCode, message: error.message });
  }
};

const sendEmailOtp = async (req, res) => {
  try {
    const response = await authService.sendEmailOtp(req);
    res.status(httpStatus.status.OK).send(response);
  } catch (error) {
    res.status(error.statusCode).send({ code: error.statusCode, message: error.message });
  }
};

const verifyEmailOtp = async (req, res) => {
  try {
    const response = await authService.verifyEmailOtp(req);
    res.status(httpStatus.status.OK).send(response);
  } catch (error) {
    res.status(error.statusCode).send({ code: error.statusCode, message: error.message });
  }
};

module.exports = {
  refreshToken,
  googleCallback,
  register,
  login,
  logout,
  sendEmailOtp,
  verifyEmailOtp,
};
