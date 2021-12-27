const nodemailer = require('nodemailer');
// const htmlToText = require('html-to-text');
const { from, user, pass, host, port } = require('../config').emailConfig;

const transporter = nodemailer.createTransport({
  host: host,
  port: port,
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

const sendAcceptationEmail = async (to, text) => {
  return await send(
    to,
    text,
    'Accept your registration',
    'Accept your registration'
  );
};
const sendRegistrationEmail = async (to, text) => {
  return await send(
    to,
    text,
    'your registration has been submitted',
    'your registration has been submitted'
  );
};
const sendRejectionEmail = async (to, text) => {
  return await send(
    to,
    text,
    'Reject your registration',
    'Reject your registration'
  );
};

const send = async (to, text, template, subject) => {
  const mailOptions = {
    from: from,
    to: to,
    subject,
    text: text,
  };
  return await transporter.sendMail(mailOptions);
};
module.exports = {
  sendPasswordReset,
  sendVerification,
  sendAcceptationEmail,
  sendRejectionEmail,
  sendRegistrationEmail,
};
