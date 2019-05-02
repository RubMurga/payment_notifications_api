const express = require('express')
const router = express.Router()
const {wrap} = require('./../util/wrap')
const swaggerConfig = require('./../util/swaggerconfig')

router.route('/')
  .get(wrap(async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerConfig.swaggerSpec)
  }))

module.exports = router
