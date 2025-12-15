// D:\TravelbucketList\backend\routes\destinationRoutes.js

const express = require('express');
const Destination = require('../models/Destination'); 
const router = express.Router();
const auth = require('../middleware/auth');
const axios = require('axios'); 
// Removed: const dotenv = require('dotenv'); and dotenv.config();

// The environment variable is accessed from the process environment
const OPEN_CAGE_API_KEY = process.env.OPEN_CAGE_API_KEY; 

// @route   GET /api/destinations
// @desc    Get all destinations for the logged-in user
router.get('/', auth, async (req, res) => { 
    try {
        const destinations = await Destination.find({ user: req.user.id }).sort({ plannedDate: 1 });
        res.json(destinations);
    } catch (error) {
        console.error("GET Destinations Error:", error.message);
        res.status(500).json({ message: 'Error retrieving destinations.', error: error.message });
    }
});

// @route   POST /api/destinations
// @desc    Create a new destination with automated Geocoding
router.post('/', auth, async (req, res) => { 
    const { name, plannedDate, totalBudget, visited, expenses } = req.body;
    
    if (!name || !expenses) {
        return res.status(400).json({ message: 'Please include destination name and expenses.' });
    }

    let latitude = 0;
    let longitude = 0;

    // --- GEOCODING LOGIC ---
    if (OPEN_CAGE_API_KEY && name) {
        try {
            const geocodeResponse = await axios.get(
                `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(name)}&key=${OPEN_CAGE_API_KEY}&limit=1`
            );

            if (geocodeResponse.data.results.length > 0) {
                const location = geocodeResponse.data.results[0].geometry;
                latitude = location.lat;
                longitude = location.lng;
            } 
        } catch (error) {
            console.error('Geocoding API Error:', error.message);
        }
    }
    // ----------------------

    const destination = new Destination({
        user: req.user.id,
        name,
        plannedDate,
        totalBudget,
        visited: visited !== undefined ? visited : false,
        expenses,
        latitude,
        longitude
    });

    try {
        const newDestination = await destination.save();
        res.status(201).json(newDestination);
    } catch (error) {
        console.error("POST Destination Error:", error.message);
        res.status(400).json({ message: 'Error creating destination.', error: error.message });
    }
});

// @route   PUT /api/destinations/:id
// @desc    Update a destination 
router.put('/:id', auth, async (req, res) => {
    try {
        const updatedDestination = await Destination.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id }, 
            req.body,
            { new: true, runValidators: true } 
        );
        
        if (!updatedDestination) {
            return res.status(404).json({ message: 'Destination not found for this user.' });
        }
        res.json(updatedDestination);
    } catch (error) {
        console.error("PUT Destination Error:", error.message);
        res.status(400).json({ message: 'Error updating destination.', error: error.message });
    }
});

// @route   DELETE /api/destinations/:id
// @desc    Delete a destination
router.delete('/:id', auth, async (req, res) => {
    try {
        const result = await Destination.findOneAndDelete({ _id: req.params.id, user: req.user.id });
        
        if (!result) {
            return res.status(404).json({ message: 'Destination not found for this user.' });
        }
        res.json({ message: 'Destination deleted successfully' });
    } catch (error) {
        console.error("DELETE Destination Error:", error.message);
        res.status(500).json({ message: 'Error deleting destination.', error: error.message });
    }
});

module.exports = router;