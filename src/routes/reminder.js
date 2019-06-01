const express = require('express')
const router = express.Router()
const Reminder = require('../models/reminder')
const User = require('../models/user')
const {wrap} = require('../util/wrap')
const email = require('../util/email')
const transport = email.getTransport()
const UserUtil = require('../util/user')

router.route('/reminders')
  .post(wrap(async (req, res) => {
    let user = await User.findOne({_id: req.body.user})
    let reminder = new Reminder()
    let today = new Date()
    reminder.self_reminder = req.body.self_reminder
    if (req.body.self_reminder) reminder.recipients = [user._id]
    else reminder.recipients = req.body.recipients 
    reminder.message = req.body.message
    reminder.title = req.body.title
    reminder.user = user._id
    reminder.remember_each = req.body.remember_each
    reminder.reminder_date = req.body.reminder_date
    reminder.creation_date = today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + today.getDay()
    await reminder.save()
    res.status(200).json({message: 'Reminder created', reminder: reminder})
  }))


/* 

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
*/
module.exports = router
