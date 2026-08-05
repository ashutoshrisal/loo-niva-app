require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const { errorHandler, notFound } = require('./middleware/errorHandler');

const activityRoutes = require('./routes/activityRoutes');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const studentRoutes = require('./routes/studentRoutes');
const publicRoutes = require('./routes/publicRoutes');
const beneficiaryRoutes = require('./routes/beneficiaryRoutes');
const reportRoutes = require('./routes/reportRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const documentRoutes = require('./routes/documentRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const schoolRoutes = require('./routes/schoolRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const sponsorRoutes = require('./routes/sponsorRoutes');
const studentSponsorRoutes = require('./routes/studentSponsorRoutes');

// BACKUP ROUTES
const backupRoutes = require('./routes/backupRoutes');

const app = express();

// ==========================================
// SECURITY & CORE MIDDLEWARE
// ==========================================

app.use(helmet());

app.use(
  cors({
    origin: [
      'http://localhost',
      'http://localhost:3000',
      'http://192.168.1.23:3000',
      'https://loo-niva-app-ui6q.vercel.app',
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  morgan(
    process.env.NODE_ENV === 'production'
      ? 'combined'
      : 'dev'
  )
);

// ==========================================
// GLOBAL API RATE LIMIT
// ==========================================

app.use(
  '/api',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
  })
);

// ==========================================
// HEALTH CHECK
// ==========================================

app.get(
  '/api/health',
  (req, res) => {
    res.json({
      success: true,
      message: 'Loo Niva API is running',
    });
  }
);

// ==========================================
// API ROUTES
// ==========================================

app.use(
  '/api/auth',
  authRoutes
);

app.use(
  '/api/projects',
  projectRoutes
);

app.use(
  '/api/students',
  studentRoutes
);

app.use(
  '/api/beneficiaries',
  beneficiaryRoutes
);

app.use(
  '/api/settings',
  settingsRoutes
);

app.use(
  '/api/activities',
  activityRoutes
);

// DATABASE BACKUP
app.use(
  '/api/backup',
  backupRoutes
);

app.use(
  '/api/organization',
  organizationRoutes
);

app.use(
  '/api/reports',
  reportRoutes
);
app.use('/api/public', publicRoutes);

app.use(
  '/api/dashboard',
  dashboardRoutes
);

app.use(
  '/api/gallery',
  galleryRoutes
);

app.use(
  '/api/documents',
  documentRoutes
);

app.use(
  '/api/events',
  eventRoutes
);

app.use(
  '/api/users',
  userRoutes
);

app.use(
  '/api/schools',
  schoolRoutes
);

app.use(
  '/api/sponsors',
  sponsorRoutes
);

app.use(
  '/api/sponsorships',
  studentSponsorRoutes
);

app.use('/api/upload', uploadRoutes);

// ==========================================
// ERROR HANDLING
// ==========================================

app.use(notFound);

app.use(errorHandler);

module.exports = app;