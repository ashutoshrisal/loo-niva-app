const { query } = require('../config/db');

// Get all sponsors
async function getAllSponsors() {
    const result = await query(`
        SELECT *
        FROM sponsors
        ORDER BY full_name ASC
    `);

    return result.rows;
}

// Get one sponsor
async function getSponsor(id) {
    const result = await query(
        `SELECT * FROM sponsors WHERE id = $1`,
        [id]
    );

    return result.rows[0];
}

// Create sponsor
async function createSponsor(sponsor) {
  const result = await query(
    `
    INSERT INTO sponsors
    (
      full_name,
      email,
      phone,
      country,
      organization_name,
      address,
      sponsor_type,
      status
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    RETURNING *;
    `,
    [
      sponsor.full_name,
      sponsor.email,
      sponsor.phone,
      sponsor.country,
      sponsor.organization,   // maps frontend field -> organization_name column
      sponsor.address,
      'organization',         // default sponsor type
      sponsor.status
    ]
  );

  return result.rows[0];
}
// Update sponsor
// Update sponsor
async function updateSponsor(id, sponsor) {
    const result = await query(
        `
        UPDATE sponsors
        SET
            full_name = $1,
            email = $2,
            phone = $3,
            country = $4,
            organization_name = $5,
            address = $6,
            sponsor_type = $7,
            status = $8,
            updated_at = NOW()
        WHERE id = $9
        RETURNING *;
        `,
        [
            sponsor.full_name,
            sponsor.email,
            sponsor.phone,
            sponsor.country,
            sponsor.organization,
            sponsor.address,
            'organization',
            sponsor.status,
            id
        ]
    );

    return result.rows[0];
}

// Delete sponsor
async function deleteSponsor(id) {
    await query(
        `DELETE FROM sponsors WHERE id = $1`,
        [id]
    );
}

module.exports = {
    getAllSponsors,
    getSponsor,
    createSponsor,
    updateSponsor,
    deleteSponsor
};