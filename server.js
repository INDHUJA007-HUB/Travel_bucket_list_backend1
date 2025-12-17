const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load env vars
dotenv.config();

// --- 1. Route Imports ---
const authRoutes = require('./routes/authRoutes');
const destinationRoutes = require('./routes/destinationRoutes');
const weatherRoutes = require('./routes/weatherRoutes'); 
const factRoutes = require('./routes/factRoutes');

const app = express();

// --- 2. CORS and Middleware ---
app.use(cors({
  origin: [
    "http://localhost:5173", 
    "https://travel-bucket-list-frontend-qtozof7rf.vercel.app", // Fixed typo (added 'ps')
    "https://travel-bucket-list-frontend-sepia.vercel.app"
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

// --- 4. Route Mounting ---
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/weather', weatherRoutes); 
app.use('/api/facts', factRoutes);

app.get('/api/test-connection', (req, res) => {
    res.status(200).json({ 
        message: 'Connection successful from frontend!',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
  res.send('Travel Bucket List API is running! 🚀');
});

// --- 5. Error handling middleware ---
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// ONLY ONE DECLARATION OF PORT HERE AT THE BOTTOM
const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});