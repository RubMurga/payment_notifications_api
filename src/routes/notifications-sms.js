const express = require('express')
const router = express.Router()
const Notification = require('./../models/notification')
const User = require('./../models/user')
const {wrap} = require('./../util/wrap')
const sms = require('./../util/sms')
const userUtil = require('./../util/user')

router.route('/notifications/sms')
  .post(wrap(async (req, res) => {
    let {recipients, message, userId} = req.body
    let user = await User.findOne({_id: userId})
    userUtil.isUserNull(user)
    let newNote = new Notification()
    newNote.recipients = recipients
    newNote.message = message
    newNote.type = 'sms'
    newNote.userId = userId
    await Promise.all([
      newNote.save(),
      sms.prepareAndSendSMS(recipients, message),
      user.increaseCount('sms')])
      .then((note) => {
        res.status(201).json({message: 'SMS notification sent', notification: note[0]})
      })
  }))
module.exports = router
