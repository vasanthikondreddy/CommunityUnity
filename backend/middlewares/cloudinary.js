// middleware/cloudinary.js
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: 'your_cloud_name',
  api_key: 'your_api_key',
  api_secret: 'your_api_secret',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'communityunity-events',
    allowed_formats: ['jpg', 'png', 'pdf'],
  },
});

const upload = multer({ storage });
module.exports = upload;
