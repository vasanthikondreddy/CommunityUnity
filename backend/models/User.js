
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  location: String,
  interests: [String],
  role: { type: String, enum: ['member', 'organizer', 'admin'], default: 'member' },
  availability: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

