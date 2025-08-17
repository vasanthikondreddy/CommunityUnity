const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  location: String,
  interests: String,
  role: { type: String, default: 'member' },
  availability: { type: String, default: 'flexible' }
});

module.exports = mongoose.model('User', userSchema);
