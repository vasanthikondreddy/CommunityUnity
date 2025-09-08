const Announcement = require('../models/AnnouncementModel');
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }

    const newAnnouncement = new Announcement({ title, message });
    await newAnnouncement.save();

    res.status(201).json({ success: true, data: newAnnouncement });
  } catch (err) {
    console.error('Error in createAnnouncement:', err);
    res.status(500).json({ error: 'Internal server error' });
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

// ✅ Update an announcement
exports.updateAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, message, role } = req.body;

    if (role !== 'organizer' && role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to update announcements.' });
    }

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      { title, message },
      { new: true }
    );

    if (!updatedAnnouncement) {
      return res.status(404).json({ error: 'Announcement not found.' });
    }

    res.status(200).json(updatedAnnouncement);
  } catch (err) {
    console.error('❌ Error updating announcement:', err);
    res.status(500).json({ error: 'Server error while updating announcement.' });
  }
};

// 🗑️ Delete an announcement
exports.deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (role !== 'organizer' && role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to delete announcements.' });
    }

    const deletedAnnouncement = await Announcement.findByIdAndDelete(id);

    if (!deletedAnnouncement) {
      return res.status(404).json({ error: 'Announcement not found.' });
    }

    res.status(200).json({ message: 'Announcement deleted successfully.' });
  } catch (err) {
    console.error('❌ Error deleting announcement:', err);
    res.status(500).json({ error: 'Server error while deleting announcement.' });
  }
};
