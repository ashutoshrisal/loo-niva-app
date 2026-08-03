const sponsorModel = require('../models/sponsorModel');

// GET /api/sponsors
exports.getSponsors = async (req, res) => {
    try {
        const sponsors = await sponsorModel.getAllSponsors();

        res.json({
            success: true,
            data: sponsors
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: 'Failed to load sponsors'
        });
    }
};

// GET /api/sponsors/:id
exports.getSponsor = async (req, res) => {
    try {
        const sponsor = await sponsorModel.getSponsor(req.params.id);

        if (!sponsor) {
            return res.status(404).json({
                success: false,
                message: 'Sponsor not found'
            });
        }

        res.json({
            success: true,
            data: sponsor
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: 'Failed to load sponsor'
        });
    }
};

// POST /api/sponsors
exports.createSponsor = async (req, res) => {
    try {
        const sponsor = await sponsorModel.createSponsor(req.body);

        res.status(201).json({
            success: true,
            data: sponsor
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: 'Failed to create sponsor'
        });
    }
};

// PUT /api/sponsors/:id
exports.updateSponsor = async (req, res) => {
    try {
        const sponsor = await sponsorModel.updateSponsor(
            req.params.id,
            req.body
        );

        res.json({
            success: true,
            data: sponsor
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: 'Failed to update sponsor'
        });
    }
};

// DELETE /api/sponsors/:id
exports.deleteSponsor = async (req, res) => {
    try {
        await sponsorModel.deleteSponsor(req.params.id);

        res.json({
            success: true,
            message: 'Sponsor deleted successfully'
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: 'Failed to delete sponsor'
        });
    }
};