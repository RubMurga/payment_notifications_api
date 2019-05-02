const express = require('express')
const router = express.Router()
const User = require('./../models/user')
const {wrap} = require('./../util/wrap')

router.route('/user/:id')
  .get(wrap(async (req, res) => {
    const user = await User.findOne({_id: req.params.id})
    res.status(200).json({user})
  }))
  .put(wrap(async (req, res) => {
    if (!req.body.name || req.body.name.length === 0) throw new Error('Name cannot be null')
    let updatedUser = await User.findOneAndUpdate({_id: req.params.id}, {name: req.body.name}, {new: true})
    res.status(200).json({message: 'User updated', user: updatedUser})
  }))

module.exports = router
