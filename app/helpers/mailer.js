var nodemailer = require('nodemailer');
var _ = require("lodash");
var lang = require("../lang");

var mailer = {
  sendMail: async function (email) {
    var mailContent = await mailer.beautifyEmail(email);

    try {
      let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SSL,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      var response = transporter.sendMail(mailContent);
      return response;
    } catch (err) {
      return err;
    }
  },
  normalizeTemplate: function (template) {
    return Object.assign({}, template);
  },
  beautifyEmail: function (email) {
    var template = email.template;
    var content = template.html;

    if ('username' in email) {
      content = _.replace(content, new RegExp('{username}', 'g'), email.username);
    }
    if ('link' in email) {
      content = _.replace(content, new RegExp('{link}', 'g'), email.link);
    }
    if ('message' in email) {
      content = _.replace(content, new RegExp('{message}', 'g'), email.message);
    }
    if ('email' in email) {
      content = _.replace(content, new RegExp('{email}', 'g'), email.email);
    }
    if ('password' in email) {
      content = _.replace(content, new RegExp('{password}', 'g'), email.password);
    }
    if ('query' in email) {
      content = _.replace(content, new RegExp('{query}', 'g'), email.query);
    }

    template.html = content;
    template.to = email.to;

    return template;
  }
}

module.exports = mailer;