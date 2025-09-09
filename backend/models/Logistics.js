const mongoose = require('mongoose');

const logisticsSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  name: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Scheduled', 'Completed'], default: 'Pending' }
});

module.exports = mongoose.model('Logistics', logisticsSchema);
