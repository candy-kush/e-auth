const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const encryptPlainTextUsingKEYAndIV = (plaintext, KEY, IV) => {
  try {
    if(!KEY) KEY = process.env.DEFAULT_AES_ENCRYPTION_KEY;
    if(!IV) IV = process.env.DEFAULT_AES_ENCRYPTION_IV;
    var key = CryptoJS.enc.Hex.parse(KEY);
    var iv = CryptoJS.enc.Hex.parse(IV);

    var encrypted = CryptoJS.AES.encrypt(plaintext, key, { iv: iv });
    return encrypted.toString();
  } catch (error) {
    console.error("Encryption error: ", error);
  }
};

const decryptCipherTextUsingKEYAndIV = (ciphertext, KEY, IV) => {
  try {
    if(!KEY) KEY = process.env.DEFAULT_AES_ENCRYPTION_KEY;
    if(!IV) IV = process.env.DEFAULT_AES_ENCRYPTION_IV;
    var key = CryptoJS.enc.Hex.parse(KEY);
    var iv = CryptoJS.enc.Hex.parse(IV);

    var decrypted = CryptoJS.AES.decrypt(ciphertext, key, { iv: iv });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Decryption error: ", error);
  }
};

const encryptTextUsingAES = (plaintext, key) => {
  try {
    if(!key) key = process.env.DEFAULT_AES_ENCRYPTION_KEY;
    const ciphertext = CryptoJS.AES.encrypt(plaintext, key).toString();
    return ciphertext;
  } catch (error) {
    console.error("Encryption error: ", error);
  }
};

const generateToken = (data, expires, secret, type) => {
  try {
    console.log("Creating JWT tokens, requested for ", type);
    const payload = {
      sub: data,
      iat: moment().unix(),
      exp: expires.unix(),
      type: type,
    };
    const jwtSecret = secret || process.env.JWT_SECRET;
    return jwt.sign(payload, jwtSecret);
  } catch (error) {
    console.log("error occured in generateToken method: ", error);
  }
};

const generateAuthTokens = (payload, tokenType) => {
  try {
    console.log("Generating tokens, payload received ", payload);
    const accessTokenExpires = moment().add(process.env.JWT_ACCESS_EXPIRE_DURATION, 'minutes');
    const accessTokenData = { id: payload.id, email: payload.email, sessionId: payload.sessionId };
    const accessToken = generateToken(accessTokenData, accessTokenExpires, null, "ACCESS");
    
    const refreshTokenExpires = moment().add(process.env.JWT_REFRESH_EXPIRE_DURATION, 'days');
    const refreshTokenData = { id: payload.id, email: payload.email, sessionId: payload.sessionId };
    const refreshToken = generateToken(refreshTokenData, refreshTokenExpires, null, "REFRESH");

    if(tokenType == "ACCESS") {
      return { accessToken };
    } else if(tokenType == "REFRESH") {
      return { refreshToken };
    } else {
      return { accessToken, refreshToken };
    }

  } catch (error) {
    console.log("error occured in generateAuthTokens method: ", error);
  }
};

module.exports = {
  encryptPlainTextUsingKEYAndIV,
  decryptCipherTextUsingKEYAndIV,
  encryptTextUsingAES,
  generateToken,
  generateAuthTokens,
};