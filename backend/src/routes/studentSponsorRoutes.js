const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/auth');

const studentSponsorController = require('../controllers/studentSponsorController');

router.use(authenticate);

// GET all sponsorships
router.get('/', studentSponsorController.getSponsorships);
// Get sponsorships for one student
router.get(
  '/student/:studentId',
  studentSponsorController.getStudentSponsors
);

// GET one sponsorship
router.get('/:id', studentSponsorController.getSponsorship);

// CREATE sponsorship
router.post('/', studentSponsorController.createSponsorship);

// UPDATE sponsorship
router.put('/:id', studentSponsorController.updateSponsorship);

// DELETE sponsorship
router.delete('/:id', studentSponsorController.deleteSponsorship);


module.exports = router;