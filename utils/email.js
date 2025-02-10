// eslint-disable-next-line import/no-extraneous-dependencies
const nodemailer = require('nodemailer');
// eslint-disable-next-line import/no-extraneous-dependencies
const htmlToText = require('html-to-text');

const pug = require('pug');
// create a class for sending emails
module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.url = url;
    this.firstName = user.name.split(' ')[0];
    this.from = `Haneen Elbendary <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }
    // this for dev env -> as testing
    return nodemailer.createTransport({
      // if you will use Gmail -> don't forget to activate "less secure app" option
      // service: 'Gmail',
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(template, subject) {
    //1) render the pug template as html -> not actual rendering to the front-end it will just convert the pug into html so we can send it
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject
      }
    );
    //2)define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      // include text version in our code will make it better for email delivery rate and also for spam filters
      text: htmlToText.htmlToText(html)
    };
    //3)create a new transport to send the email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcoming Message!😘');
  }

  async sendPasswordRest() {
    await this.send(
      'passwordReset',
      'Your Password Rest Token (Valid for 10 minutes only))'
    );
  }
};
