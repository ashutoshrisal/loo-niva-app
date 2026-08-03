const studentSponsorModel = require('../models/studentSponsorModel');

// Get all sponsorships
exports.getSponsorships = async (req, res) => {
    try {
        const sponsorships = await studentSponsorModel.getAllSponsorships();

        res.json({
            success: true,
            data: sponsorships
        });
    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: 'Failed to load sponsorships'
        });
    }
};

// Get one sponsorship
exports.getSponsorship = async (req, res) => {
    try {
        const sponsorship = await studentSponsorModel.getSponsorship(req.params.id);

        if (!sponsorship) {
            return res.status(404).json({
                success: false,
                message: 'Sponsorship not found'
            });
        }

        res.json({
            success: true,
            data: sponsorship
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: 'Failed to load sponsorship'
        });
    }
};

// Create sponsorship
exports.createSponsorship = async (req, res) => {
    try {
        const sponsorship = await studentSponsorModel.createSponsorship(req.body);

        res.status(201).json({
            success: true,
            data: sponsorship
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: 'Failed to create sponsorship'
        });
    }
};

// Update sponsorship
exports.updateSponsorship = async (req, res) => {
    try {
        const sponsorship = await studentSponsorModel.updateSponsorship(
            req.params.id,
            req.body
        );

        res.json({
            success: true,
            data: sponsorship
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: 'Failed to update sponsorship'
        });
    }
};

// Delete sponsorship
exports.deleteSponsorship = async (req, res) => {
    try {
        await studentSponsorModel.deleteSponsorship(req.params.id);

        res.json({
            success: true,
            message: 'Sponsorship deleted'
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: 'Failed to delete sponsorship'
        });
    }
};
exports.getStudentSponsors = async (req, res) => {
    try {
        const sponsors =
            await studentSponsorModel.getStudentSponsors(
                req.params.studentId
            );

        res.json({
            success: true,
            data: sponsors
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: 'Failed to load student sponsors'
        });
    }
};