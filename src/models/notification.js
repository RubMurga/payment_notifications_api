const mongoose = require('mongoose')

const { Schema } = mongoose
const notificationSchema = new Schema({
  recipients: [{type: mongoose.Schema.Types.ObjectId }],
  message: {type: String, required: true},
  title: {type: String, trim: true},
  userId: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  remember_each: {type: Number, required: true, default: 1}
})

module.exports = mongoose.model('Notification', notificationSchema)
