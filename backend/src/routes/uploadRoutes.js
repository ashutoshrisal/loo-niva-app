const express = require('express');
const { authenticate } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

const router = express.Router();
router.use(authenticate);

// POST /api/upload  (multipart/form-data, field name: "file")
// Returns the Cloudinary URL to be saved against a project/activity/gallery/document record.
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
  res.status(201).json({
    success: true,
    data: { url: req.file.path, public_id: req.file.filename },
  });
});

module.exports = router;
