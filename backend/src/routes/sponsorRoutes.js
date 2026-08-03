const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/auth');
const sponsorController = require('../controllers/sponsorController');

// Protect all routes
router.use(authenticate);

// GET all sponsors
router.get('/', sponsorController.getSponsors);

// GET one sponsor
router.get('/:id', sponsorController.getSponsor);

// CREATE sponsor
router.post('/', sponsorController.createSponsor);

// UPDATE sponsor
router.put('/:id', sponsorController.updateSponsor);

// DELETE sponsor
router.delete('/:id', sponsorController.deleteSponsor);


module.exports = router;