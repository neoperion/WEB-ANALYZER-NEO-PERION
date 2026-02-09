const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('AI-Powered Website Analyzer API is running');
});

// Import modules
app.use('/api/seo', require('./modules/seo/routes'));
app.use('/api/ux', require('./modules/ux/routes'));
app.use('/api/performance', require('./modules/performance/routes'));
app.use('/api/content', require('./modules/content/routes'));

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
