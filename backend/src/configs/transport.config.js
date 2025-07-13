const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

transport.verify()
  .then(() => console.log('Connected to node mailer email service'))
  .catch(() => console.warn('Unable to connect to node mailer email service'));

module.exports = {
  transport
};