// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// ALWAYS force local environment for direct node execution
const isLocalEnvironment = true;
console.log('Starting server in local environment...');

// Create Express app
const app = express();

// Middleware
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint
app.get('/', (req, res) => {
  console.log('Health check endpoint accessed');
  res.send('Server is running in local mode');
});

app.get('/api/health', (req, res) => {
  console.log('API health check endpoint accessed');
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    environment: 'development'
  });
});

// Set the port for local server
const PORT = process.env.PORT || 5001;

// Start a local server
app.listen(PORT, () => {
  console.log(`✅ Local server running on port ${PORT}`);
  console.log(`👉 Try accessing: http://localhost:${PORT}/api/health`);
});

// If we get this far, the server has started
console.log('Script execution completed');