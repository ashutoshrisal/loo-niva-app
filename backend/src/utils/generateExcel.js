const ExcelJS = require('exceljs');

/**
 * Streams an Excel workbook of the given rows directly to the HTTP response.
 * `columns` = [{ header: 'Title', key: 'title', width: 30 }, ...]
 */
async function streamExcel(res, filename, columns, rows) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Loo Niva Child Concern Group';
  const sheet = workbook.addWorksheet('Data');

  sheet.columns = columns;
  sheet.getRow(1).font = { bold: true };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

  rows.forEach((row) => sheet.addRow(row));

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);

  await workbook.xlsx.write(res);
  res.end();
}

module.exports = { streamExcel };
