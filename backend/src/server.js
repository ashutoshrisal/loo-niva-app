const app = require('./app');


const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

const server = app.listen(PORT, HOST, () => {
  console.log(`Loo Niva API server listening on ${HOST}:${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});