// D:\TravelbucketList\backend\server.js

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load env vars (CRITICAL: Must run before accessing process.env)
dotenv.config();

// --- 0. CRITICAL: Define the Allowed Frontend URL ---
// 1. Checks for the FRONTEND_URL environment variable (set on Render)
// 2. Falls back to localhost for local development
// We will use the hardcoded URL as a fallback for production environments too, 
// just to ensure it's always available if the env variable isn't set, 
// but using the variable is preferred.
const ALLOWED_ORIGIN = process.env.FRONTEND_URL 
    || 'https://travel-bucket-list-frontend-sepia.vercel.app' // Fallback for Vercel
    || 'http://localhost:5173';
// ----------------------------------------------------

// --- 1. Route Imports (Keep these organized) ---
const authRoutes = require('./routes/authRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const weatherRoutes = require('./routes/weatherRoutes'); 
const factRoutes = require('./routes/factRoutes');

const app = express();

// --- 2. CORS and Middleware ---
// CRITICAL FIX: Use the dynamic ALLOWED_ORIGIN variable
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "htravel-bucket-list-frontend-qtozof7rf.vercel.app" // Your live Vercel link
  ],
  credentials: true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// --- 3. MongoDB Connection ---
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected Successfully! ✅'))
.catch(err => {
  console.error('MongoDB Connection Error:', err.message);
  process.exit(1); 
});

// --- 4. Route Mounting (Use these once, correctly) ---
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/weather', weatherRoutes); 
app.use('/api/facts', factRoutes);

// Test connection endpoint for the frontend
app.get('/api/test-connection', (req, res) => {
    res.status(200).json({ 
        message: 'Connection successful from frontend!',
        timestamp: new Date().toISOString()
    });
});

// Fallback Test route
app.get('/', (req, res) => {
  res.send('Travel Bucket List API is running! 🚀');
});

// --- 5. Error handling middleware ---
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;

// Change your port listener to this:
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});