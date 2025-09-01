const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],

  checkedInAt: { type: Date, default: null },
});

module.exports = mongoose.model("Volunteer", volunteerSchema);
