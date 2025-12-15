// D:\TravelbucketList\backend\routes\weatherRoutes.js

const express = require('express');
const router = express.Router();
const axios = require('axios');
// Removed: const dotenv = require('dotenv'); and dotenv.config();

const OPEN_WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY; 

// @route  GET /api/weather/:cityName
// @desc   Get current weather data for a specified city
router.get('/:cityName', async (req, res) => {
    const cityName = req.params.cityName;

    if (!OPEN_WEATHER_API_KEY) {
        return res.status(500).json({ message: 'Weather API key not configured on the server.' });
    }

    const url = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${OPEN_WEATHER_API_KEY}`;

    try {
        const response = await axios.get(url);
        
        const weatherData = {
            temperature: response.data.main.temp,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon,
            city: response.data.name,
            country: response.data.sys.country
        };

        res.json(weatherData);

    } catch (error) {
        console.error(`Weather API Error for ${cityName}:`, error.message);
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ message: `Weather data not found for ${cityName}` });
        }
        res.status(500).json({ message: 'Error fetching weather data.' });
    }
});

module.exports = router;