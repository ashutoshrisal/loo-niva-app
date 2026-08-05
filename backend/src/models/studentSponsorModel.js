const { query } = require('../config/db');

// Get all sponsorships
async function getAllSponsorships() {
    const result = await query(`
        SELECT
            ss.id,
            st.full_name AS student_name,
            sp.full_name AS sponsor_name,
            ss.student_id,
            ss.sponsor_id,
            ss.monthly_amount,
            ss.sponsorship_start,
            ss.sponsorship_end,
            ss.status
        FROM student_sponsors ss
        JOIN students st
            ON st.id = ss.student_id
        JOIN sponsors sp
            ON sp.id = ss.sponsor_id
        ORDER BY st.full_name ASC;
    `);

    return result.rows;
}

// Get one sponsorship
async function getSponsorship(id) {
    const result = await query(
        `
        SELECT *
        FROM student_sponsors
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0];
}

// Create sponsorship
async function createSponsorship(data) {
    const result = await query(
        `
        INSERT INTO student_sponsors
        (
            student_id,
            sponsor_id,
            monthly_amount,
            sponsorship_start,
            sponsorship_end,
            status
        )
        VALUES ($1,$2,$3,$4,$5,$6)
        RETURNING *;
        `,
        [
            data.student_id,
            data.sponsor_id,
            data.monthly_amount,
            data.sponsorship_start,
            data.sponsorship_end,
            data.status
        ]
    );

    return result.rows[0];
}

// Update sponsorship
async function updateSponsorship(id, data) {
    const result = await query(
        `
        UPDATE student_sponsors
        SET
            student_id = $1,
            sponsor_id = $2,
            monthly_amount = $3,
            sponsorship_start = $4,
            sponsorship_end = $5,
            status = $6
        WHERE id = $7
        RETURNING *;
        `,
        [
            data.student_id,
            data.sponsor_id,
            data.monthly_amount,
            data.sponsorship_start,
            data.sponsorship_end,
            data.status,
            id
        ]
    );

    return result.rows[0];
}

// Delete sponsorship
async function deleteSponsorship(id) {
    await query(
        `
        DELETE FROM student_sponsors
        WHERE id = $1
        `,
        [id]
    );
}

module.exports = {
    getAllSponsorships,
    getSponsorship,
    createSponsorship,
    updateSponsorship,
    deleteSponsorship,
    getStudentSponsors
};
async function getStudentSponsors(studentId) {
    const result = await query(
        `
        SELECT
            ss.*,
            COALESCE(s.organization_name, s.full_name) AS sponsor_name
        FROM student_sponsors ss
        JOIN sponsors s
            ON s.id = ss.sponsor_id
        WHERE ss.student_id = $1
        ORDER BY ss.created_at DESC
        `,
        [studentId]
    );

    return result.rows;
}