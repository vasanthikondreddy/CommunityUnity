const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  location: String,
  interests: [String],
 
  role: {
    type: String,
    enum: ['organizer', 'volunteer','admin','member'],
    default: 'volunteer'
  },
  availability: String,
  checkedIn: { type: Boolean, default: false },
  checkInTime: { type: Date, default: null }, 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
