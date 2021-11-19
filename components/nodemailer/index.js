const nodemailer = require('nodemailer');
const config = require('../../config');

const transporter = nodemailer.createTransport(config.mail);

const sendMail = ({
  to,
  subject,
  text,
}) => transporter.sendMail({
  from: config.mail.auth.user,
  to,
  subject,
  text,
  dsn: {
    id: 'some random message specific id',
    return: 'headers',
    notify: ['failure', 'delay'],
    recipient: to,
  },
});

module.exports = sendMail;
