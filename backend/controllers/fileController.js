const path = require('path');
const fs = require('fs');

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file.filename,
      path: `/uploads/${req.file.filename}`,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error during file upload' });
  }
};

exports.getFile = async (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, '..', 'uploads', filename);

  if (fs.existsSync(filepath)) {
    res.sendFile(filepath);
  } else {
    res.status(404).json({ error: 'File not found' });
  }
};
