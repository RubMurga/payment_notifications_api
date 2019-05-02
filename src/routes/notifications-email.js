const express = require('express')
const router = express.Router()
const Notification = require('./../models/notification')
const User = require('./../models/user')
const {wrap} = require('./../util/wrap')
const email = require('./../util/email')
const transport = email.getTransport()
const UserUtil = require('./../util/user')

router.route('/notifications/email')
  .post(wrap(async (req, res) => {
    let {recipients, message, title, userId} = req.body
    let user = await User.findOne({_id: userId})
    UserUtil.isUserNull(user)
    if (!Array.isArray(recipients) && recipients.length > 0) recipients = new Array(recipients)
    let newEmails = recipients.map(recipient => email.prepareEmail(recipient, message, title))
    let newNote = new Notification()
    newNote.recipients = recipients
    newNote.message = message
    newNote.title = title
    newNote.type = 'email'
    newNote.userId = userId
    await Promise.all([
      email.sendEmail(transport, newEmails),
      newNote.save(),
      user.increaseCount('email')])
      .then((note) => {
        res.status(201).json({message: 'Email notification sent', notification: note[1]})
      })
  }))

module.exports = router
