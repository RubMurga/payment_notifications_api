const express = require('express')
const router = express.Router()
const User = require('./../models/user')
const {wrap} = require('./../util/wrap')

router.route('/users')
  .post(wrap(async (req, res) => {
    let newUser = new User()
    newUser.name = req.body.name
    newUser.username = req.body.username
    newUser.password = req.body.password
    newUser.email_notification = req.body.email_notification
    newUser.sms_notification = req.body.sms_notification
    newUser.email = req.body.email
    newUser.phone_number = req.body.phone_number
    await newUser.save()
    res.status(201).json({message: 'User created', user: newUser})
  }))

module.exports = router
