const express = require('express');
const router = express.Router();

const { authenticate, authorize } = require('../middleware/auth');


const {
  listBeneficiaries,
  getBeneficiary,
  createBeneficiary,
  updateBeneficiary,
  deleteBeneficiary,
} = require('../controllers/beneficiaryController');

router.use(
  authenticate,
  authorize(
    'super_admin',
    'project_manager',
    'field_staff'
  )
);

// GET
router.get('/', listBeneficiaries);
router.get('/:id', getBeneficiary);

// CREATE
router.post(
  '/',
  authorize('super_admin', 'project_manager'),
  createBeneficiary
);

// UPDATE
router.put(
  '/:id',
  authorize('super_admin', 'project_manager'),
  updateBeneficiary
);

// DELETE
router.delete(
  '/:id',
  authorize('super_admin'),
  deleteBeneficiary
);

module.exports = router;