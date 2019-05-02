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
    await newUser.save()
    res.status(201).json({message: 'User created', user: newUser})
  }))

module.exports = router
