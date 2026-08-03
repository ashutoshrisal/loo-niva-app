const { query } = require('../config/db');
const { streamReportPDF } = require('../utils/generatePDF');
const { streamExcel } = require('../utils/generateExcel');

async function listReports(req, res) {
  try {
    const [
      students,
      beneficiaries,
      sponsors,
      schools,
      projects,
      activities,
      donations,
      budget,
      recentActivities,
      monthlyActivities,
      monthlyDonations,
      projectStatus,
      beneficiaryGender,
    ] = await Promise.all([
      query("SELECT COUNT(*) FROM students"),
      query("SELECT COUNT(*) FROM beneficiaries"),
      query("SELECT COUNT(*) FROM sponsors"),
      query("SELECT COUNT(*) FROM schools"),
      query("SELECT COUNT(*) FROM projects"),
      query("SELECT COUNT(*) FROM activities"),

      query(`
        SELECT COALESCE(SUM(amount), 0) AS total
        FROM donations
      `),

      query(`
        SELECT COALESCE(SUM(budget), 0) AS total
        FROM projects
      `),

      query(`
        SELECT
          id,
          title,
          activity_date
        FROM activities
        ORDER BY activity_date DESC
        LIMIT 5
      `),

      query(`
        SELECT
          TO_CHAR(activity_date, 'Mon') AS month,
          COUNT(*)::int AS total
        FROM activities
        GROUP BY
          EXTRACT(MONTH FROM activity_date),
          TO_CHAR(activity_date, 'Mon')
        ORDER BY EXTRACT(MONTH FROM activity_date)
      `),

      query(`
        SELECT
          TO_CHAR(donation_date, 'Mon') AS month,
          COALESCE(SUM(amount), 0) AS total
        FROM donations
        GROUP BY
          EXTRACT(MONTH FROM donation_date),
          TO_CHAR(donation_date, 'Mon')
        ORDER BY EXTRACT(MONTH FROM donation_date)
      `),

      query(`
        SELECT
          status,
          COUNT(*)::int AS total
        FROM projects
        GROUP BY status
      `),

      query(`
        SELECT
          gender,
          COUNT(*)::int AS total
        FROM beneficiaries
        GROUP BY gender
      `),
    ]);

    res.json({
      success: true,

      data: {
        stats: {
          students: Number(students.rows[0].count),
          beneficiaries: Number(beneficiaries.rows[0].count),
          sponsors: Number(sponsors.rows[0].count),
          schools: Number(schools.rows[0].count),
          projects: Number(projects.rows[0].count),
          activities: Number(activities.rows[0].count),
          donations: Number(donations.rows[0].total),
          budget: Number(budget.rows[0].total),
        },

        recentActivities: recentActivities.rows,
        monthlyActivities: monthlyActivities.rows,
        monthlyDonations: monthlyDonations.rows,
        projectStatus: projectStatus.rows,
        beneficiaryGender: beneficiaryGender.rows,
      },
    });
  } catch (err) {
    console.error('Reports error:', err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}


// =====================================================
// EXPORT PDF
// =====================================================

async function exportPdf(req, res) {
  try {
    const [
      students,
      beneficiaries,
      sponsors,
      schools,
      projects,
      activities,
      donations,
      budget,
      recentActivities,
    ] = await Promise.all([
      query("SELECT COUNT(*) FROM students"),
      query("SELECT COUNT(*) FROM beneficiaries"),
      query("SELECT COUNT(*) FROM sponsors"),
      query("SELECT COUNT(*) FROM schools"),
      query("SELECT COUNT(*) FROM projects"),
      query("SELECT COUNT(*) FROM activities"),

      query(`
        SELECT COALESCE(SUM(amount), 0) AS total
        FROM donations
      `),

      query(`
        SELECT COALESCE(SUM(budget), 0) AS total
        FROM projects
      `),

      query(`
        SELECT
          title,
          activity_date
        FROM activities
        ORDER BY activity_date DESC
        LIMIT 10
      `),
    ]);

    const reportData = {
      generatedAt: new Date(),

      stats: {
        students: Number(students.rows[0].count),
        beneficiaries: Number(beneficiaries.rows[0].count),
        sponsors: Number(sponsors.rows[0].count),
        schools: Number(schools.rows[0].count),
        projects: Number(projects.rows[0].count),
        activities: Number(activities.rows[0].count),
        donations: Number(donations.rows[0].total),
        budget: Number(budget.rows[0].total),
      },

      recentActivities: recentActivities.rows,
    };

    return streamReportPDF(res, reportData);

  } catch (err) {
    console.error('PDF export error:', err);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate PDF report',
      });
    }
  }
}


// =====================================================
// EXPORT EXCEL
// =====================================================

async function exportExcel(req, res) {
  try {
    const [
      students,
      beneficiaries,
      sponsors,
      schools,
      projects,
      activities,
      donations,
      budget,
      recentActivities,
    ] = await Promise.all([
      query("SELECT COUNT(*) FROM students"),
      query("SELECT COUNT(*) FROM beneficiaries"),
      query("SELECT COUNT(*) FROM sponsors"),
      query("SELECT COUNT(*) FROM schools"),
      query("SELECT COUNT(*) FROM projects"),
      query("SELECT COUNT(*) FROM activities"),

      query(`
        SELECT COALESCE(SUM(amount), 0) AS total
        FROM donations
      `),

      query(`
        SELECT COALESCE(SUM(budget), 0) AS total
        FROM projects
      `),

      query(`
        SELECT
          title,
          activity_date
        FROM activities
        ORDER BY activity_date DESC
        LIMIT 10
      `),
    ]);

    const rows = [
      {
        metric: 'Students',
        value: Number(students.rows[0].count),
      },
      {
        metric: 'Beneficiaries',
        value: Number(beneficiaries.rows[0].count),
      },
      {
        metric: 'Sponsors',
        value: Number(sponsors.rows[0].count),
      },
      {
        metric: 'Schools',
        value: Number(schools.rows[0].count),
      },
      {
        metric: 'Projects',
        value: Number(projects.rows[0].count),
      },
      {
        metric: 'Activities',
        value: Number(activities.rows[0].count),
      },
      {
        metric: 'Total Donations',
        value: Number(donations.rows[0].total),
      },
      {
        metric: 'Project Budget',
        value: Number(budget.rows[0].total),
      },
    ];

    return await streamExcel(
      res,
      'loo-niva-organization-report',
      [
        {
          header: 'Metric',
          key: 'metric',
          width: 30,
        },
        {
          header: 'Value',
          key: 'value',
          width: 20,
        },
      ],
      rows
    );
  } catch (err) {
    console.error('Excel export error:', err);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate Excel report',
      });
    }
  }
}


module.exports = {
  listReports,
  exportPdf,
  exportExcel,
};