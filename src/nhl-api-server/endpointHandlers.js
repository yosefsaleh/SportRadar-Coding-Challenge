const express = require('express');
const axios = require('axios');
const app = express();
const port = 8000;

app.get('/api/schedule', async (req, res) => {
    console.log('Endpoint /api/schedule hit');

    const season = req.query.season;

    try {
        console.log('Sending request to third-party API');
        const response = await axios.get(`https://statsapi.web.nhl.com/api/v1/schedule?season=${season}`);
        console.log('Response received from third-party API');

        // Let's print the first 1000 characters of the response
        console.log(JSON.stringify(response.data).substr(0, 1000));

        res.json({ message: "Check console for third-party API response." });
    } catch (error) {
        console.error('Error while requesting data from third-party API', error);
        res.status(500).json({ error: 'An error occurred while trying to fetch the schedule.' });
    }
});

app.get('/api/game/:game_id/boxscore', async (req, res) => {
    try {
        const response = await axios.get(`https://statsapi.web.nhl.com/api/v1/game/${req.params.game_id}/boxscore`);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while trying to fetch the game boxscore.' });
    }
});

app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`);
});

module.exports = app; 