const Event = require("../models/Event");



exports.createEvent = async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSignup = async (req, res) => {
  const { eventId } = req.params;
  const { user_id } = req.body;

  try {
   
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    
    const signup = new Signup({
      event_id: eventId,
      user_id,
      status: "signed-up"
    });

    await signup.save();
    res.status(201).json({ message: "Signup successful", signup });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
