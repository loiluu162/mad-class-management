const nodemailer = require('nodemailer');
// const htmlToText = require('html-to-text');
const { from, user, pass, host } = require('../config').emailConfig;

const transporter = nodemailer.createTransport({
  host: host,
  port: 587,
  auth: {
    user: user,
    pass: pass,
  },
});

const sendVerification = async (to, token) => {
  return await send(
    to,
    token,
    'welcome',
    'Your verification code (valid for only 60 minutes)'
  );
};
const sendPasswordReset = async (to, token) => {
  return await send(
    to,
    token,
    'passwordReset',
    'Your password reset code (valid for only 60 minutes)'
  );
};

const send = async (to, token, template, subject) => {
  const text = 'Your code: ' + token;
  const mailOptions = {
    from: from,
    to: to,
    subject,
    text: text,
  };
  return await transporter.sendMail(mailOptions);
};
module.exports = { sendPasswordReset, sendVerification };
