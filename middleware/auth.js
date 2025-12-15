// D:\TravelbucketList\backend\middleware\auth.js

const jwt = require('jsonwebtoken'); 
const dotenv = require('dotenv');

// Load environment variables (like JWT_SECRET)
dotenv.config();

const auth = (req, res, next) => {
    // 1. Get token from the header sent by the frontend
    const token = req.header('x-auth-token'); 

    // 2. Check if token exists
    if (!token) {
        // HTTP 401: Unauthorized
        return res.status(401).json({ message: 'No token, authorization denied. Please log in.' });
    }

    try {
        // 3. Verify token and decode the payload
        // This line checks if the signature is valid and if the token is expired.
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        
        // 4. Attach the user payload to the request (req.user now contains { id: userId })
        req.user = decoded.user;
        
        // 5. Pass control to the next route handler (e.g., in destinationRoutes.js)
        next();
    } catch (err) {
        // If verification fails (e.g., wrong secret, token expired)
        res.status(401).json({ message: 'Token is not valid or has expired.' });
    }
};

module.exports = auth;