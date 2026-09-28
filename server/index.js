import express from 'express';
import cors from 'cors';

import assignmentRoutes from './routes/assignmentRoutes.js';

// 1. Initialize Express Application
const app = express();

const PORT = process.env.PORT || 5000;

// ===================================================================
// 2. GLOBAL MIDDLEWARE LAYER
// ===================================================================

// Built-in JSON Body Parsing Middleware
app.use(express.json());

// Enable Cross-Origin Resource Sharing (CORS) for React frontend
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'x-user-role']
}));

// Custom Application-Level Request Logging Middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(
    `[${timestamp}] Incoming Request: ${req.method} => ${req.originalUrl}`
  );
  next();
});

// ===================================================================
// 3. API ROUTE DEFINITIONS
// ===================================================================

// Mount RESTful Resource Routes
app.use('/api/assignments', assignmentRoutes);

// Server Diagnostics Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'Healthy',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// Handle Invalid/Non-Existent API Routes (404 Fallback)
app.use((req, res, next) => {
  const error = new Error(
    `Resource Not Found on Server - ${req.originalUrl}`
  );
  error.statusCode = 404;
  next(error);
});

// ===================================================================
// 4. CENTRALIZED ERROR HANDLING MIDDLEWARE
// ===================================================================
app.use((err, req, res, next) => {
  console.error(
    '🚨 Central Error Handler Caught Exception:',
    err.message
  );

  const status = err.statusCode || 500;

  res.status(status).json({
    success: false,
    error: {
      status: status,
      message:
        err.message || 'Fatal Internal Server Exception Occurred'
    }
  });
});

// ===================================================================
// 5. HTTP SERVER INITIALIZATION
// ===================================================================
app.listen(PORT, () => {
  console.log(
    `=======================================================`
  );
  console.log(
    `🚀 Node.js Express Server actively listening on Port: ${PORT}`
  );
  console.log(
    `📡 Local Environment API Root: http://localhost:${PORT}/api/assignments`
  );
  console.log(
    `=======================================================`
  );
});

export default app;
