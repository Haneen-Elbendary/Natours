// eslint-disable-next-line import/no-extraneous-dependencies
const nodemaile = require('nodemailer');

const sendEmail = async options => {
  // to send email
  // 1 - create transporter
  const transporter = nodemaile.createTransport({
    // if you will use Gmail -> don't forget to activate "less secure app" option
    // service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  // 2 - define the eamil options
  const mailOptions = {
    from: 'Haneen Elbendary <haneenelbendary@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message
  };
  // 3 - send the mail
  await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
