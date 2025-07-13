const { OAuth2Client } = require("google-auth-library");
const { google } = require("googleapis");
const moment = require('moment');
const jwt = require('jsonwebtoken');
const httpStatus = require("http-status");
const { UserSecondary, User } = require('../models');
const { v4: uuidv4 } = require('uuid');
const { validateSignupData, encryptPlainTextUsingKEYAndIV, AppError, sendEmail, generateAuthTokens } = require("../utils");
const { redisClient } = require("../configs");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const OAUTH_REDIRECT_URI = process.env.OAUTH_REDIRECT_URI;
const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, OAUTH_REDIRECT_URI);

const googleCallback = async (req) => {
  try {
    console.log("handling o-auth callback response");
    const { tokens } = await client.getToken(req.query?.code);
    client.setCredentials(tokens);
    const oauth2 = google.oauth2({ auth: client, version: "v2" });
    const { data } = await oauth2.userinfo.get();
    console.log("User Data: ", data);
    const user = await User.create({
      name: data.given_name + " " + data.family_name,
      email: data.email,
      gender: data.gender,
      activeSessionCount: 1,
    });

    const sessionId = uuidv4();
    const authTokens = generateAuthTokens({id: user.id, email: user.email, sessionId: sessionId});
    if(!authTokens) throw new AppError(httpStatus.status.SERVICE_UNAVAILABLE, 'Something went wrong, please try again in sometimes');
    
    await redisClient.set(`token:${user.id}:session:${sessionId}:ACCESS`, authTokens?.accessToken, {
      EX: process.env.JWT_ACCESS_EXPIRE_DURATION * 60,
    });

    await redisClient.set(`token:${user.id}:session:${sessionId}:REFRESH`, authTokens?.refreshToken, {
      EXAT: moment().add(process.env.JWT_REFRESH_EXPIRE_DURATION, 'days').unix(),
    });

    await redisClient.sAdd(`session:${user.id}`, sessionId);
    return {
      token: authTokens.refreshToken,
      secret: authTokens.accessToken,
      key: sessionId,
      next: "http://127.0.0.1:5500/webpage/html/main-page.html"
    };

  } catch (error) {
    console.log("error in googleCallback method: ", error);
  }
};

const refreshToken = async (req) => {
  try {
    console.log("Refreshing user auth tokens");
    const refreshToken = req.headers?.['x-refresh-token'] || req.headers?.['authorization']?.split(' ')[1];
    const { key: sessionId } = req.query || {};
    if(!sessionId || !refreshToken) throw new AppError(httpStatus.status.BAD_REQUEST, 'Invalid request');

    let userId;
    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
      userId = payload.sub.id;
    } catch (error) {
      console.log("error occured in refreshToken ", error);
      throw new AppError(httpStatus.status.UNAUTHORIZED, 'Invalid or expired token');
    }

    const existingToken = await redisClient.get(`token:${userId}:session:${sessionId}:REFRESH`);
    if (!existingToken || existingToken !== refreshToken) throw new AppError(httpStatus.status.UNAUTHORIZED, 'Token expired, please login again to continue');

    const user = await UserSecondary.findOne({ _id: userId, status: "ACTIVE", blacklisted: false });
    if (!user) throw new AppError(httpStatus.status.FORBIDDEN, 'No active user found');
    
    user.sessionId = sessionId;
    const tokens = generateAuthTokens(user, "ACCESS");
    
    await redisClient.set(`token:${user.id}:session:${sessionId}:ACCESS`, tokens?.accessToken, {
      EX: process.env.JWT_ACCESS_EXPIRE_DURATION * 60,
    });
    
    return {
      code: 200,
      sessionId: sessionId,
      tokens: {
        accessToken: tokens?.accessToken,
        refreshToken: refreshToken,
      }
    };

  } catch (error) {
    console.log("error occured in refreshToken method: ", error);
    if(error.statusCode) {
      throw new AppError(error.statusCode, error.message);
    } else {
      throw new AppError(httpStatus.status.INTERNAL_SERVER_ERROR, "Something went wrong, please try again after sometimes");
    }
  }
};

const sendEmailOtp = async (req) => {
  try {
    const email = req.query?.email;
    if(!email) throw new AppError(httpStatus.status.BAD_REQUEST, "Invalid request");
    const otp = Math.floor(100000 + Math.random() * 900000);

    const emailBody = `<!DOCTYPE html>
<html lang="en" style="margin: 0; padding: 0;">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>OTP Verification</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
  <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif;">
    <tr>
      <td align="center" style="padding: 40px 10px;">
        <table width="100%" max-width="600px" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <tr>
            <td align="center" style="background-color: #4a90e2; padding: 15px;">
              <h1 style="color: #ffffff; margin: 0;">OTP Verification</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px 40px; color: #333;">
              <p style="font-size: 16px;">Dear <strong>Customer</strong>,</p>
              <p style="font-size: 16px;">Use the following One-Time Password (OTP) to verify your email address. The OTP is valid for <strong>5 minutes</strong>.</p>
              <p style="text-align: center; font-size: 32px; font-weight: bold; color: #4a90e2; letter-spacing: 5px; margin: 30px 0;">${otp}</p>
              <p style="font-size: 14px; color: #666;">If you did not request this, please ignore this email.</p>
              <p style="margin-top: 30px; font-size: 14px;">Thanks,<br>The Team</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px; background-color: #f4f4f4; color: #999; font-size: 12px;">
              &copy; 2025 Your Company Name. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    console.log(`Sending OTP on ${email} : ${otp}`);
    sendEmail(email, 'OTP for email verification', emailBody, otp);
    await redisClient.set(`otp:${email}:${otp}`, otp, {
      EX: 300,
    });

    return {
      code: 200,
      message: "OTP sent on " + email.slice(0, 4) + "*****@" + email.split('@')[1],
    };

  } catch (error) {
    console.log("error occured in sendEmailOtp: ", error);
    if(error.statusCode) {
      throw new AppError(error.statusCode, error.message);
    } else {
      throw new AppError(httpStatus.status.INTERNAL_SERVER_ERROR, "Something went wrong, please try again after sometimes");
    }
  }
};

const verifyEmailOtp = async (req) => {
  try {
    const { otp, email } = req.query || {};
    console.log(`Verifying OTP ${otp} sent on email ${email}`);
    if(!email || !otp) throw new AppError(httpStatus.status.BAD_REQUEST, "Invalid request");

    const savedOtp = await redisClient.get(`otp:${email}:${otp}`);
    if (!savedOtp || savedOtp !== otp) {
      throw new AppError(httpStatus.status.FORBIDDEN, "Invalid or expired OTP");
    }

    console.log("OTP verified");
    await redisClient.del(`otp:${email}:${otp}`);
    return {
      code: 200, 
      verified: true,
      message: "OTP verified, please continue"
    };

  } catch (error) {
    console.log("error occured in verifyEmailOtp: ", error);
    if(error.statusCode) {
      throw new AppError(error.statusCode, error.message);
    } else {
      throw new AppError(httpStatus.status.INTERNAL_SERVER_ERROR, "Something went wrong, please try again after sometimes");
    }
  }
};

const login = async (req) => {
  try {
    const { email, password } = req.body || {};
    console.log("Login attempted for email: ", email);
    if(!email || !password) throw new AppError(httpStatus.status.FORBIDDEN, 'Login credentials required to continue');
    
    const encryptedPassword = encryptPlainTextUsingKEYAndIV(password);
    const user = await UserSecondary.findOne({ email: email, password: encryptedPassword });

    if (!user) throw new AppError(httpStatus.status.FORBIDDEN, 'Invalid Credentials');
    if (user.blacklisted) throw new AppError(httpStatus.status.FORBIDDEN, 'Account has been blacklisted');
    if (user.activeSessionCount >= process.env.USER_ACTIVE_SESSION_COUNT) throw new AppError(httpStatus.status.FORBIDDEN, 'Maximum active session reached, please logout from active places to continue');

    const sessionId = uuidv4();
    const tokens = generateAuthTokens({id: user.id, email: user.email, sessionId: sessionId});
    if(!tokens) throw new AppError(httpStatus.status.SERVICE_UNAVAILABLE, 'Something went wrong, please try again in sometimes');
    
    await redisClient.set(`token:${user.id}:session:${sessionId}:ACCESS`, tokens?.accessToken, {
      EX: process.env.JWT_ACCESS_EXPIRE_DURATION * 60,
    });

    await redisClient.set(`token:${user.id}:session:${sessionId}:REFRESH`, tokens?.refreshToken, {
      EXAT: moment().add(process.env.JWT_REFRESH_EXPIRE_DURATION, 'days').unix(),
    });

    await redisClient.sAdd(`session:${user.id}`, sessionId);
    
    await User.findOneAndUpdate({ email: email, password: encryptedPassword }, {
      $set: {
        isLogedIn: true,
        status: "ACTIVE"
      },
      $inc: { activeSessionCount: 1 }
    });
    
    return {
      code: 200,
      message: `Hi ${user.name}, Welcome back!`,
      tokens: tokens,
      sessionId: sessionId,
    };
    
  } catch (error) {
    console.log("error occured in login method: ", error);
    if(error.statusCode) {
      throw new AppError(error.statusCode, error.message);
    } else {
      throw new AppError(httpStatus.status.INTERNAL_SERVER_ERROR, "Something went wrong, please try again after sometimes");
    }
  }
};

const register = async (req) => {
  try {
    console.log("New registration detected with request body: ", req.body);
    const { name, email, password, age, gender } = req.body || {};
    validateSignupData({ name, email, password, age, gender });

    const existingUser = await UserSecondary.findOne({ email: email });
    if(existingUser) {
      console.log(`Account already exists with ${email}`);
      throw new AppError(httpStatus.status.FORBIDDEN, `Account already exists with ${email}`);
    }

    const encryptedPassword = encryptPlainTextUsingKEYAndIV(password);
    const user = await User.create({
      name: name,
      email: email,
      password: encryptedPassword,
      age: age,
      gender: gender,
      activeSessionCount: 1,
    });
    console.log("User created: ", user);

    const sessionId = uuidv4();
    const tokens = generateAuthTokens({id: user.id, email: user.email, sessionId: sessionId});
    if(!tokens) throw new AppError(httpStatus.status.SERVICE_UNAVAILABLE, 'Something went wrong, please try again in sometimes');
    
    await redisClient.set(`token:${user.id}:session:${sessionId}:ACCESS`, tokens?.accessToken, {
      EX: process.env.JWT_ACCESS_EXPIRE_DURATION * 60,
    });
    await redisClient.set(`token:${user.id}:session:${sessionId}:REFRESH`, tokens?.refreshToken, {
      EXAT: moment().add(process.env.JWT_REFRESH_EXPIRE_DURATION, 'days').unix(),
    });

    await redisClient.sAdd(`session:${user.id}`, sessionId);
    
    return { 
      code: 200, 
      tokens: tokens,
      sessionId: sessionId,
      message: "Congratulations! Welcome to the team 🎊",
    };
    
  } catch (error) {
    console.log("error occured in register method: ", error);
    if(error.statusCode) {
      throw new AppError(error.statusCode, error.message);
    } else {
      throw new AppError(httpStatus.status.INTERNAL_SERVER_ERROR, "Something went wrong, please try again after sometimes");
    }
  }
};

const logout = async (req) => {
  try {
    const { userId } = req.params || {};
    console.log("Logout attempted for userId: ", userId);

    const { sessionid: sessionId, type } = req.headers || {};
    if(!userId || !sessionId) throw new AppError(httpStatus.status.BAD_REQUEST, 'Invalid request');

    const user = await User.findOne({ _id: userId, status: "ACTIVE", isLoggedIn: true, blacklisted: false });

    if (!user) throw new AppError(httpStatus.status.FORBIDDEN, 'No active user found');
    
    const existingAccessToken = await redisClient.get(`token:${user.id}:session:${sessionId}:ACCESS`);
    const existingRefreshToken = await redisClient.get(`token:${user.id}:session:${sessionId}:REFRESH`);
    if(!existingAccessToken || !existingRefreshToken) throw new AppError(httpStatus.status.FORBIDDEN, 'User session inactive');
    
    if(type == 'web') {
      console.log("Logging out from all sessions");
      const sessions = await redisClient.sMembers(`session:${userId}`);
      for (const sId of sessions) {
        await redisClient.del(`token:${userId}:session:${sId}:ACCESS`);
        await redisClient.del(`token:${userId}:session:${sId}:REFRESH`);
      }
      await redisClient.del(`session:${userId}`);
      user.isLogedIn = false;

    } else {
      await redisClient.del(`token:${user.id}:session:${sessionId}:ACCESS`);
      await redisClient.del(`token:${user.id}:session:${sessionId}:REFRESH`);
      await redisClient.sRem(`session:${user.id}`, sessionId);
      user.activeSessionCount -= 1;
      if(user.activeSessionCount == 0) {
        user.isLogedIn = false;
      }
    }
    await user.save();
    
    console.log("User session logged out: ", sessionId);
    return {
      code: 200,
      status: "success",
      message: "Sad time to say Goodbye 👋"
    };
    
  } catch (error) {
    console.log("error occured in logout method: ", error);
    if(error.statusCode) {
      throw new AppError(error.statusCode, error.message);
    } else {
      throw new AppError(httpStatus.status.INTERNAL_SERVER_ERROR, "Something went wrong, please try again after sometimes");
    }
  }
};

module.exports = {
  googleCallback,
  refreshToken,
  sendEmailOtp,
  verifyEmailOtp,
  login,
  register,
  logout,
};
