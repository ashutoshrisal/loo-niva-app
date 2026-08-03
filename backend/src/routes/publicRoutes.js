const express = require('express');
const router = express.Router();
const { query } = require('../config/db');

// ==========================================
// PUBLIC HOMEPAGE STATISTICS
// ==========================================

router.get('/stats', async (req, res) => {
  try {
    const [
      projects,
      beneficiaries,
      activities,
      districts,
    ] = await Promise.all([
      query(`
        SELECT COUNT(*)::int AS count
        FROM projects
      `),

      query(`
        SELECT COUNT(*)::int AS count
        FROM beneficiaries
      `),

      query(`
        SELECT COUNT(*)::int AS count
        FROM activities
      `),

      query(`
        SELECT COUNT(DISTINCT LOWER(TRIM(district)))::int AS count
        FROM students
        WHERE district IS NOT NULL
          AND TRIM(district) <> ''
      `),
    ]);

    res.json({
      success: true,
      data: {
        projects: projects.rows[0].count,
        beneficiaries: beneficiaries.rows[0].count,
        activities: activities.rows[0].count,
        districts: districts.rows[0].count,
      },
    });

  } catch (error) {
    console.error('Public stats error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to load public statistics',
    });
  }
});


// ==========================================
// PUBLIC EVENTS
// ==========================================

router.get('/events', async (req, res) => {
  try {
const result = await query(`
      SELECT
        id,
        title,
        description,
        event_date,
        start_time,
        end_time,
        location
      FROM events
      WHERE event_date IS NOT NULL
        AND event_date >= CURRENT_DATE
      ORDER BY event_date ASC, start_time ASC
      LIMIT 12
    `);

    res.json({
      success: true,
      data: result.rows,
    });

  } catch (error) {
    console.error('Public events error:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to load public events',
    });
  }
});


// ==========================================
// EXPORT ROUTER
// ==========================================

module.exports = router;