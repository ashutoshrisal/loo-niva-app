const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

async function backupDatabase(req, res) {
  const tempFile = path.join(
    os.tmpdir(),
    `loo_niva_backup_${Date.now()}.sql`
  );

  try {
    const dbUrl = new URL(process.env.DATABASE_URL);

    const database = decodeURIComponent(
      dbUrl.pathname.replace(/^\//, '')
    );

    const username = decodeURIComponent(
      dbUrl.username
    );

    const password = decodeURIComponent(
      dbUrl.password
    );

    const host = dbUrl.hostname || 'localhost';

    const port = dbUrl.port || '5432';

    // PostgreSQL installation path on this PC
    const pgDumpPath =
      'C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe';

    if (!fs.existsSync(pgDumpPath)) {
      return res.status(500).json({
        success: false,
        message: 'pg_dump.exe was not found on this computer.',
      });
    }

    const args = [
      '-h',
      host,

      '-p',
      port,

      '-U',
      username,

      '-d',
      database,

      '-F',
      'p',

      '-f',
      tempFile,
    ];

    const pgDump = spawn(pgDumpPath, args, {
      env: {
        ...process.env,
        PGPASSWORD: password,
      },
      windowsHide: true,
    });

    let errorOutput = '';

    pgDump.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pgDump.on('error', (err) => {
      console.error('pg_dump process error:', err);

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Failed to start database backup.',
        });
      }
    });

    pgDump.on('close', (code) => {
      if (code !== 0) {
        console.error('pg_dump failed:', errorOutput);

        if (fs.existsSync(tempFile)) {
          fs.unlinkSync(tempFile);
        }

        if (!res.headersSent) {
          return res.status(500).json({
            success: false,
            message:
              'Database backup failed.',
          });
        }

        return;
      }

      if (!fs.existsSync(tempFile)) {
        return res.status(500).json({
          success: false,
          message:
            'Backup file was not created.',
        });
      }

      const date = new Date()
        .toISOString()
        .slice(0, 10);

      const filename =
        `loo_niva_backup_${date}.sql`;

      res.download(
        tempFile,
        filename,
        (err) => {
          // Always remove temporary file
          if (fs.existsSync(tempFile)) {
            fs.unlinkSync(tempFile);
          }

          if (err) {
            console.error(
              'Backup download error:',
              err
            );
          }
        }
      );
    });
  } catch (err) {
    console.error(
      'Database backup error:',
      err
    );

    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
    }

    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message:
          'Could not create database backup.',
      });
    }
  }
}

module.exports = {
  backupDatabase,
};