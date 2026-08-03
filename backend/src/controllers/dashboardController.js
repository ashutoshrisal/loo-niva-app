const { query } = require('../config/db');

// Dashboard Cards
async function summary(req, res) {
  try {
    const [
      students,
      schools,
      sponsors,
      sponsorships,
      activeStudents,
    ] = await Promise.all([
      query(`SELECT COUNT(*) FROM students`),
      query(`SELECT COUNT(*) FROM schools`),
      query(`SELECT COUNT(*) FROM sponsors`),
      query(`SELECT COUNT(*) FROM student_sponsors`),
      query(`SELECT COUNT(*) FROM students WHERE status='active'`)
    ]);

    res.json({
      success: true,
      data: {
        totalStudents: Number(students.rows[0].count),
        totalSchools: Number(schools.rows[0].count),
        totalSponsors: Number(sponsors.rows[0].count),
        totalSponsorships: Number(sponsorships.rows[0].count),
        activeStudents: Number(activeStudents.rows[0].count),
      },
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Dashboard summary failed",
    });
  }
}

// Monthly Student Registration Graph
async function monthlyActivity(req, res) {
  try {
    const result = await query(`
      SELECT
        to_char(date_trunc('month', created_at),'YYYY-MM') AS month,
        COUNT(*) AS count
      FROM students
      GROUP BY 1
      ORDER BY 1;
    `);

    res.json({
      success: true,
      data: result.rows,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Monthly activity failed",
    });
  }
}

// Analytics
async function analytics(req, res) {
  try {

    const [
      grades,
      gender,
      countries,
      schools,
    ] = await Promise.all([

      query(`
        SELECT grade, COUNT(*) count
        FROM students
        GROUP BY grade
        ORDER BY grade
      `),

      query(`
        SELECT gender, COUNT(*) count
        FROM students
        GROUP BY gender
      `),

      query(`
        SELECT country, COUNT(*) count
        FROM sponsors
        GROUP BY country
      `),

      query(`
        SELECT
          schools.name,
          COUNT(students.id) count
        FROM schools
        LEFT JOIN students
          ON students.school_id = schools.id
        GROUP BY schools.name
        ORDER BY schools.name
      `)

    ]);

    res.json({
      success: true,
      data: {
        grades: grades.rows,
        gender: gender.rows,
        sponsorCountries: countries.rows,
        schools: schools.rows,
      },
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Analytics failed",
    });

  }
}

// Small Stats (used in LSP)
async function stats(req, res) {
  try {

    const [
      students,
      schools,
      sponsors,
      activeStudents,
    ] = await Promise.all([

      query(`SELECT COUNT(*) FROM students`),
      query(`SELECT COUNT(*) FROM schools`),
      query(`SELECT COUNT(*) FROM sponsors`),
      query(`SELECT COUNT(*) FROM students WHERE status='active'`)

    ]);

    res.json({
      success: true,
      data: {
        students: Number(students.rows[0].count),
        schools: Number(schools.rows[0].count),
        sponsors: Number(sponsors.rows[0].count),
        activeStudents: Number(activeStudents.rows[0].count),
      },
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false,
      message: "Stats failed",
    });

  }
}

module.exports = {
  summary,
  monthlyActivity,
  analytics,
  stats,
};