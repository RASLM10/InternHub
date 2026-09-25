require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const connectDB = require('./backend/config/db');
const { notFound, errorHandler } = require('./backend/middleware/errorMiddleware');

const app = express();

// Connect to database
connectDB();

// Security headers - allow Google Fonts
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));

// Serve static files from public/
app.use(express.static(path.join(__dirname, 'public')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'InternHub API is running',
    timestamp: new Date()
  });
});

// API Routes
app.use('/api/auth', require('./backend/routes/authRoutes'));
app.use('/api/users', require('./backend/routes/userRoutes'));
app.use('/api/jobs', require('./backend/routes/jobRoutes'));
app.use('/api/companies', require('./backend/routes/companyRoutes'));
app.use('/api/applications', require('./backend/routes/applicationRoutes'));
app.use('/api/saved-jobs', require('./backend/routes/savedJobRoutes'));
app.use('/api/contact', require('./backend/routes/contactRoutes'));
app.use('/api/admin', require('./backend/routes/adminRoutes'));

// For unknown API routes, return JSON 404
app.use('/api/*', notFound);

// For all other routes: serve index.html (SPA fallback for direct page loads)
app.get('*', (req, res) => {
  // If the path has a file extension, 404 it (e.g. missing assets)
  if (path.extname(req.path)) {
    return res.status(404).send('Not found');
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 InternHub server running on http://localhost:${PORT}`);
    console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
}

module.exports = app;

