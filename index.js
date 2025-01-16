const express = require('express');
const axios = require('axios');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = 3000;

// Replace with your Open UV API key
const OPENUV_API_KEY = 'openuv-cmzv8xrm5zm1o6h-io';

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.set('views', path.join(__dirname, 'views'));

// Default location (Replace with your home coordinates if needed)
const defaultLocation = {
    lat: 37.7749, // Latitude for San Francisco, CA
    lng: -122.4194 // Longitude for San Francisco, CA
};

app.get('/', async (req, res) => {
    try {
        const response = await axios.get('https://api.openuv.io/api/v1/uv', {
            headers: {
                'x-access-token': OPENUV_API_KEY
            },
            params: {
                lat: defaultLocation.lat,
                lng: defaultLocation.lng
            }
        });

        const uvIndex = response.data.result.uv;
        const sunscreenNeeded = uvIndex >= 3; // Sunscreen recommended for UV index of 3 or higher

        res.render('index', {
            uvIndex: uvIndex.toFixed(1),
            sunscreenNeeded
        });
    } catch (error) {
        console.error(error.response ? error.response.data : error.message);
        res.render('index', {
            uvIndex: 'Error',
            sunscreenNeeded: false,
            error: 'Could not fetch UV data. Please check your API key or try again later.'
        });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
