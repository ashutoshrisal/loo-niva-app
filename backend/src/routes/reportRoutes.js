const express = require('express');

const { authenticate, authorize } = require('../middleware/auth');

const {
  listReports,
  exportPdf,
  exportExcel,
} = require('../controllers/reportController');

const router = express.Router();

router.use(authenticate);

// Organization reports
router.get('/', listReports);

// Excel
router.get(
  '/export/excel',
  authorize('super_admin', 'project_manager'),
  exportExcel
);

// PDF
router.get(
  '/export/pdf',
  authorize('super_admin', 'project_manager'),
  exportPdf
);

module.exports = router;