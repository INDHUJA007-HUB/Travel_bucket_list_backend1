// D:\TravelbucketList\backend\routes\factRoutes.js

const express = require('express');
const router = express.Router();
// No changes needed here, assuming the simulated function is safe.

// This is the simulated function:
const getCityFacts = async (cityName) => {
    // We assume a real search/AI API would be called here.
    
    if (cityName.toLowerCase().includes('paris')) {
        return {
            title: 'Top Attractions and Facts',
            fact: "Paris, known as the 'City of Light,' has one of the world's most visited monuments, the Eiffel Tower, which was originally intended to be a temporary installation.",
            attractions: [
                "Eiffel Tower",
                "Louvre Museum (Home of the Mona Lisa)",
                "Notre-Dame Cathedral",
                "Arc de Triomphe"
            ],
            link: "https://www.youtube.com/watch?v=MULrP0nEIM4"
        };
    } else {
        return {
            title: 'Facts Search',
            fact: `Search for top facts and attractions for ${cityName} to populate here!`,
            attractions: ['Local Market', 'Main Square', 'Historic Site'],
            link: null
        };
    }
}

// @route  GET /api/facts/:cityName
// @desc   Get interesting facts and recommendations for a city
router.get('/:cityName', async (req, res) => {
    const cityName = req.params.cityName;

    if (!cityName) {
        return res.status(400).json({ message: 'City name is required.' });
    }

    try {
        const factsData = await getCityFacts(cityName); 
        res.json(factsData);

    } catch (error) {
        console.error(`Fact Search Error for ${cityName}:`, error.message);
        res.status(500).json({ message: 'Error retrieving city facts.' });
    }
});

module.exports = router;