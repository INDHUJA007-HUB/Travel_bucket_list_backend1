// D:\TravelbucketList\backend\routes\authRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const jwt = require('jsonwebtoken'); 
const dotenv = require('dotenv'); 

// *** CRITICAL FIX: IMPORT AUTH MIDDLEWARE ***
const auth = require('../middleware/auth'); 
// ********************************************

// Assuming server.js already calls dotenv.config(), but it's safe to keep it here
// if you ever run this route file in isolation.
dotenv.config(); 

// Helper function to create the authentication response with a JWT
const createAuthResponse = (user) => {
    const payload = {
        user: {
            id: user._id, // The user ID is stored in the JWT payload
        }
    };

    // CRITICAL: Generate the real JWT token using the secret from .env
    const token = jwt.sign(
        payload, 
        process.env.JWT_SECRET, 
        { expiresIn: '5d' } // Token expires in 5 days
    );

    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        token: token, // Returning the real token
    };
};

// @route POST /api/auth/register
// @desc Register a new user
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body; 

    try {
        // Check for Duplicate User
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Create user (Triggers hashing middleware in User.js)
        const user = await User.create({ username, email, password });
        
        if (user) {
            // Success: Return 201 Created and the user object with the JWT
            res.status(201).json(createAuthResponse(user));
        } else {
            res.status(400).json({ message: 'Invalid user data provided.' });
        }
    } catch (error) {
        console.error("!!! FATAL REGISTRATION ERROR !!!:", error);
        
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: `Registration failed: Missing or invalid data. Details: ${error.message}` });
        }
        if (error.code === 11000) { 
            return res.status(400).json({ message: 'This email is already registered.' });
        }
        
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
});

// @route POST /api/auth/login 
// @desc Authenticate user and get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });
        
        // Assuming your User model has a matchPassword method
        if (user && (await user.matchPassword(password))) { 
            // Success: Return user data with the JWT
            res.json(createAuthResponse(user));
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error("Login Server Error:", error);
        res.status(500).json({ message: 'Server error during login.', error: error.message });
    }
});

// @route GET /api/auth/user
// @desc Get user data after successful token verification
// @access Private
router.get('/user', auth, async (req, res) => {
    try {
        // req.user.id is set by the 'auth' middleware
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({ 
            _id: user._id, 
            username: user.username, 
            email: user.email 
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;