const express = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { listDocuments, createDocument, deleteDocument } = require('../controllers/documentController');

const router = express.Router();
router.use(authenticate);

router.get('/', listDocuments);
router.post('/', authorize('super_admin', 'project_manager'), createDocument);
router.delete('/:id', authorize('super_admin'), deleteDocument);

module.exports = router;
