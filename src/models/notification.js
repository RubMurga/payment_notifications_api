const mongoose = require('mongoose')

const { Schema } = mongoose
const notificationSchema = new Schema({
  recipients: [{type: String, trim: true, required: true}],
  message: {type: String, trim: true, required: true, default: 'Custom payload'},
  title: {type: String, trim: true},
  type: {type: String, enum: ['email', 'sms', 'push', 'pubsub'], required: true},
  userId: {type: Schema.Types.ObjectId, ref: 'User', required: true}
})

const castErrorMongoose = (error, doc, next) => {
  if (error.name === 'CastError') next(new Error('There was an error trying to cast notificationId'))
}
notificationSchema.post('findOne', castErrorMongoose)
module.exports = mongoose.model('Notification', notificationSchema)
