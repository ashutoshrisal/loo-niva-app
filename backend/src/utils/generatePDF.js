const PDFDocument = require('pdfkit');

/**
 * Generate and stream the Loo Niva organization report PDF.
 */
function streamReportPDF(res, report) {
  const doc = new PDFDocument({
    margin: 50,
    size: 'A4',
  });

  res.setHeader('Content-Type', 'application/pdf');

  res.setHeader(
    'Content-Disposition',
    'attachment; filename="loo-niva-organization-report.pdf"'
  );

  doc.pipe(res);

  // ==============================
  // HEADER
  // ==============================

  doc
    .fillColor('#1E3A8A')
    .fontSize(20)
    .font('Helvetica-Bold')
    .text(
      'Loo Niva Child Concern Group',
      {
        align: 'center',
      }
    );

  doc
    .fillColor('#16A34A')
    .fontSize(12)
    .font('Helvetica')
    .text(
      'Organization Performance Report',
      {
        align: 'center',
      }
    );

  doc.moveDown();

  doc
    .fillColor('#555555')
    .fontSize(9)
    .text(
      `Generated: ${new Date(report.generatedAt).toLocaleString()}`,
      {
        align: 'center',
      }
    );

  doc.moveDown(2);

  // ==============================
  // SUMMARY
  // ==============================

  doc
    .fillColor('#000000')
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('Organization Summary');

  doc.moveDown();

  const stats = report.stats;

  const summary = [
    ['Students', stats.students],
    ['Beneficiaries', stats.beneficiaries],
    ['Sponsors', stats.sponsors],
    ['Schools', stats.schools],
    ['Projects', stats.projects],
    ['Activities', stats.activities],
    [
      'Total Donations',
      `NPR ${Number(stats.donations).toLocaleString()}`,
    ],
    [
      'Project Budget',
      `NPR ${Number(stats.budget).toLocaleString()}`,
    ],
  ];

  summary.forEach(([label, value]) => {
    doc
      .font('Helvetica-Bold')
      .fontSize(11)
      .fillColor('#1E3A8A')
      .text(`${label}: `, {
        continued: true,
      });

    doc
      .font('Helvetica')
      .fillColor('#000000')
      .text(String(value));

    doc.moveDown(0.4);
  });

  doc.moveDown();

  // ==============================
  // FINANCIAL SUMMARY
  // ==============================

  doc
    .font('Helvetica-Bold')
    .fontSize(16)
    .fillColor('#000000')
    .text('Financial Summary');

  doc.moveDown();

  doc
    .font('Helvetica')
    .fontSize(11)
    .fillColor('#000000')
    .text(
      `Total Donations: NPR ${Number(
        stats.donations
      ).toLocaleString()}`
    );

  doc.moveDown(0.5);

  doc.text(
    `Project Budget: NPR ${Number(
      stats.budget
    ).toLocaleString()}`
  );

  doc.moveDown(0.5);

  const difference =
    Number(stats.donations) -
    Number(stats.budget);

  doc.text(
    `Difference: NPR ${difference.toLocaleString()}`
  );

  doc.moveDown(2);

  // ==============================
  // RECENT ACTIVITIES
  // ==============================

  doc
    .font('Helvetica-Bold')
    .fontSize(16)
    .fillColor('#000000')
    .text('Recent Activities');

  doc.moveDown();

  if (
    !report.recentActivities ||
    report.recentActivities.length === 0
  ) {
    doc
      .font('Helvetica')
      .fontSize(11)
      .fillColor('#555555')
      .text('No recent activities available.');
  } else {
    report.recentActivities.forEach((activity, index) => {
      const date = activity.activity_date
        ? new Date(
            activity.activity_date
          ).toLocaleDateString()
        : '-';

      doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .fillColor('#1E3A8A')
        .text(`${index + 1}. ${activity.title}`);

      doc
        .font('Helvetica')
        .fontSize(10)
        .fillColor('#555555')
        .text(`Date: ${date}`);

      doc.moveDown(0.7);
    });
  }

  // ==============================
  // FOOTER
  // ==============================

  doc.moveDown(2);

  doc
    .font('Helvetica')
    .fontSize(9)
    .fillColor('#777777')
    .text(
      'Loo Niva Child Concern Group — Confidential Organization Report',
      {
        align: 'center',
      }
    );

  doc.end();
}

module.exports = {
  streamReportPDF,
};