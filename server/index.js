const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
// Configure CORS for production (Netlify) and development
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? (process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests) in development
    if (!origin) {
      return callback(null, process.env.NODE_ENV === 'development');
    }
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS. Origin: ${origin}`));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files for PWA
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

async function connectToDatabase() {
  // Railway provides MongoDB via MONGO_URL or DATABASE_URL, fallback to MONGODB_URI
  // Also check for Railway's service reference format
  const mongoUri = process.env.MONGO_URL || 
                   process.env.DATABASE_URL || 
                   process.env.MONGODB_URI ||
                   process.env.MONGODB_URL;
  
  // Debug: Log available env vars (without sensitive data)
  if (isProduction && !mongoUri) {
    console.log('🔍 Available environment variables:', Object.keys(process.env).filter(k => 
      k.includes('MONGO') || k.includes('DATABASE') || k.includes('DB')
    ).join(', ') || 'none found');
  }

  // In production, MongoDB URI is required
  if (isProduction && !mongoUri) {
    throw new Error(
      'MongoDB connection string is required in production. ' +
      'Railway should provide MONGO_URL, DATABASE_URL, or MONGODB_URI. ' +
      'Please ensure your MongoDB service is connected to your backend service in Railway.'
    );
  }

  // In development, warn if MONGODB_URI is not set
  if (!isProduction && !mongoUri) {
    console.warn('⚠️  MONGODB_URI not set. Attempting to use in-memory MongoDB for development...');
  }

  // Try to connect to MongoDB Atlas (or provided URI)
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, {
        // These options are recommended for MongoDB Atlas
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });
      console.log('✅ Connected to MongoDB');
      return null;
    } catch (error) {
      console.error('❌ MongoDB connection error:', error.message);

      if (isProduction) {
        throw new Error(
          `Failed to connect to MongoDB: ${error.message}. ` +
          'Please check your MONGODB_URI environment variable.'
        );
      }

      // In development, fall back to in-memory MongoDB
      console.warn('⚠️  Falling back to in-memory MongoDB for development...');
      // Don't return here, let it continue to the fallback section below
    }
  }

  // Development fallback: in-memory MongoDB
  if (!isProduction) {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log('✅ Connected to in-memory MongoDB (development only)');
      console.warn('⚠️  Note: Data will be lost when server restarts. Set MONGODB_URI for persistent storage.');

      process.on('SIGINT', async () => {
        await mongoose.connection.close();
        await mongod.stop();
        process.exit(0);
      });

      return mongod;
    } catch (memError) {
      console.error('❌ Failed to start in-memory MongoDB:', memError.message);
      throw new Error(
        'Unable to connect to MongoDB. ' +
        'Please set MONGODB_URI environment variable with your MongoDB Atlas connection string.'
      );
    }
  }

  throw new Error('MongoDB connection failed');
}

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('🚫 Unable to start server:', error);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;

