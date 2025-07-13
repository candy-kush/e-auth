const { transport } = require("../configs");

const sendEmail = async (to, subject, html) => {
  try {
    const msg = { from: process.env.SEND_EMAIL_FROM, to, subject, html };
    await transport.sendMail(msg);
  } catch (error) {
    console.log("error occured in sendEmail utility: ", error);
  }
};

module.exports = {
  sendEmail
};