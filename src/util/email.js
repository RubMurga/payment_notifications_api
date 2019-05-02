const nodemailer = require('nodemailer')

module.exports = {
  getTransport: function () {
    let config = {
      pool: true,
      host: process.env.SMTPHOST,
      port: process.env.SMTPPORT,
      secure: false,
      tls: {ciphers: 'SSLv3'},
      auth: {
        user: process.env.SMTPEMAIL,
        pass: process.env.SMTPPASSWD
      }
    }
    let transport = nodemailer.createTransport(config)
    return transport
  },
  prepareEmail: function (recipients, message, subject) {
    if (this.validateEmails(recipients) === false) throw new Error('Invalid emails')
    else if (!message) throw new Error('Message required')
    let email = {
      from: '"Ruben Murga" <notificaciones@rubenmurga.mx>',
      bcc: recipients,
      subject: subject || 'Notificación',
      text: message
    }
    return email
  },
  sendEmail: async function (transporter, emails) {
    try {
      const emailP = emails.map(email => transporter.sendMail(email))
      await Promise.all(emailP)
    } catch (error) {
      throw new Error(`Error sending email
      ${error.name} - ${error.message}`)
    }
  },
  validateEmails: function (emails) {
    let emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!emails || emails.length < 1) return false
    else if (typeof emails === 'string' && emailRegex.test(emails)) return true
    else if (Array.isArray(emails)) {
      let emailsLength = emails.length
      for (let index = 0; index < emailsLength; index++) {
        if (emailRegex.test(emails[index]) === false) return false
      }
      return true
    } else return false
  }
}
