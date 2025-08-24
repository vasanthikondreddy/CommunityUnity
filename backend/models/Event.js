const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  date: Date,
  location: String,
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  file: {
    file_name: String,
    file_url: String,
  },
  signups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Event', EventSchema);
