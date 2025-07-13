const { AppError } = require("./appError.utils");
const httpStatus = require("http-status");

const validateSignupData = ({ name, email, password, age, gender }) => {
  if(!name || !email || !password || !age || !gender) {
    throw new AppError(httpStatus.status.BAD_REQUEST, "Missing request data");
  }

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    throw new AppError(httpStatus.status.BAD_REQUEST, "Name is required and must be at least 2 characters");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new AppError(httpStatus.status.BAD_REQUEST, "A valid email address is required");
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new AppError(httpStatus.status.BAD_REQUEST, "Password is required and must be at least 6 characters long");
  }

  if (age === undefined || isNaN(age) || age <= 0 || age > 120) {
    throw new AppError(httpStatus.status.BAD_REQUEST, "Age is required and must be a valid number between 1 and 120");
  }

  const allowedGenders = ['male', 'female', 'other'];
  if (!gender || !allowedGenders.includes(gender.toLowerCase())) {
    throw new AppError(httpStatus.status.BAD_REQUEST, "Gender must be one of 'male', 'female', or 'other'");
  }
};

module.exports = { 
  validateSignupData 
};