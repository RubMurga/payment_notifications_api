require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const mongoose = require('mongoose')
const morgan = require('morgan')
const swaggerUI = require('swagger-ui-express')
const {wrap} = require('./src/util/wrap')
const swaggerConfig = require('./src/util/swaggerconfig')
const users = require('./src/routes/users')
const userId = require('./src/routes/user-id')
const recipients = require('./src/routes/recipient')
const reminders = require('./src/routes/reminder')
const docs = require('./src/routes/docs')
const {errorHandler} = require('./src/util/errorHandler')
const app = express()
const DBOPTIONS = { keepAlive: 1, connectTimeoutMS: 30000, useNewUrlParser: true }
mongoose.set('useCreateIndex', true);
const PORT = process.env.PORT || 3000

async function run () {
  // Middlewares
  app.use(bodyParser.text())
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(compression())
  // Allowed Headers
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization')
    next()
  })

  app.use('/api', users)
  app.use('/api', userId)
  app.use('/api', recipients)
  app.use('/api', reminders)
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerConfig.swaggerSpec))
  app.use('/docs.json', docs)
  app.use(errorHandler)
  // Mongoose bootstrapping
  mongoose.Promise = global.Promise
  mongoose.connect("mongodb://rubmrg:postcardfrom1952!@payment-api-shard-00-00-ewptt.mongodb.net:27017,payment-api-shard-00-01-ewptt.mongodb.net:27017,payment-api-shard-00-02-ewptt.mongodb.net:27017/test?ssl=true&replicaSet=payment-api-shard-0&authSource=admin&retryWrites=true", DBOPTIONS)
  const db = mongoose.connection
  db.on('error', wrap(console.error.bind(console, 'DB connection error: ')))

  app.listen(PORT)
  console.log(`Listening on port: ${PORT}`)
  
}
run().catch(error => console.error(error.stack))

module.exports = app
