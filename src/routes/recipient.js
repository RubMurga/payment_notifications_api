const express = require('express')
const router = express.Router()
const User = require('./../models/user')
const Recipient = require('./../models/recipient')
const {wrap} = require('./../util/wrap')

router.route('/recipient/:user')
  .get(wrap(async (req, res) => {
    const user = await User.findOne({_id: req.params.id})
    res.status(200).json({user})
  }))
  .put(wrap(async (req, res) => {
    if (!req.body.name || req.body.name.length === 0) throw new Error('Name cannot be null')
    let updatedUser = await User.findOneAndUpdate({_id: req.params.id}, {name: req.body.name}, {new: true})
    res.status(200).json({message: 'User updated', user: updatedUser})
  }))
  .post(wrap(async (req, res) => {
    const user = await User.findOne({_id: req.params.user})
    let recipient = new Recipient()
    recipient.name = req.body.name
    recipient.email_notification = req.body.email_notification
    recipient.sms_notification = req.body.sms_notification
    recipient.email = req.body.email
    recipient.phone_number = req.body.phone_number
    recipient.user = req.params.user
    await recipient.save()
    res.status(200).json({message: 'Recipient created', user: recipient})
  }))

module.exports = router
