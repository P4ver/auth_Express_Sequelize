const { configDotenv } = require('dotenv');
configDotenv();

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,//"smtp-relay.brevo.com"
    port: 587,
    // secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

module.exports = transporter;