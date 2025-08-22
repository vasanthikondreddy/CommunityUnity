const mongoose = require('mongoose');

const eventSignupSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['signed-up', 'checked-in'], default: 'signed-up' }
});

module.exports = mongoose.model('EventSignup', eventSignupSchema);
