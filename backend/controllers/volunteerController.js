const Volunteer = require("../models/Volunteer");

exports.registerVolunteer = async (req, res) => {
  try {
    const volunteer = new Volunteer(req.body);
    await volunteer.save();
    res.status(201).json(volunteer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().populate("events");
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
