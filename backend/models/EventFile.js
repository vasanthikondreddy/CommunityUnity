const mongoose = require('mongoose');

const eventFileSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  file_name: {
    type: String,
    required: true
  },
  file_url: {
    type: String,
    required: true
  },
  uploaded_at: {
    type: Date,
    default: Date.now
  }
});


module.exports = mongoose.model('EventFile', eventFileSchema);
