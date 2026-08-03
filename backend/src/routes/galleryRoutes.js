const express = require('express');

const {
  authenticate,
  authorize,
} = require('../middleware/auth');

const {
  listGallery,
  addGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');

const router = express.Router();

/*
|--------------------------------------------------------------------------
| PUBLIC GALLERY
|--------------------------------------------------------------------------
| No login required.
| Used by the public homepage.
*/
router.get('/public', async (req, res) => {
  try {
    const { query } = require('../config/db');

    const result = await query(`
      SELECT
        id,
        media_type,
        file_url,
        caption,
        created_at
      FROM gallery
      WHERE media_type = 'image'
      ORDER BY created_at DESC
      LIMIT 12
    `);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error('Public gallery error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to load public gallery',
    });
  }
});


/*
|--------------------------------------------------------------------------
| STAFF GALLERY
|--------------------------------------------------------------------------
| Login required.
*/
router.use(authenticate);

router.get('/', listGallery);

router.post(
  '/',
  authorize(
    'super_admin',
    'project_manager',
    'field_staff'
  ),
  addGalleryItem
);

router.delete(
  '/:id',
  authorize(
    'super_admin',
    'project_manager'
  ),
  deleteGalleryItem
);

module.exports = router;