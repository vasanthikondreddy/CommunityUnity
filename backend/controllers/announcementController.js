const Announcement = require('../models/AnnouncementModel');

exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: "Title and message are required." });
    }

    const newAnnouncement = await Announcement.create({ title, message });

    // Emit real-time update
    const io = req.app.get("io");
    io.emit("newAnnouncement", newAnnouncement);

    res.status(201).json(newAnnouncement);
  } catch (err) {
    console.error("❌ Error creating announcement:", err);
    res.status(500).json({ error: "Server error while creating announcement." });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json(announcements);
  } catch (err) {
    console.error("❌ Error fetching announcements:", err);
    res.status(500).json({ error: "Server error while fetching announcements." });
  }
};
