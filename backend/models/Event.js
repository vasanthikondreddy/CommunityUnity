const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: String,
  description: String,
  organizer: String,
});

module.exports = mongoose.model("Event", eventSchema);
