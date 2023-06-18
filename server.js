const express = require('express');
const axios = require('axios');
const app = express();
const port = 8000;

app.get('/api/team/:team_id', async (req, res) => {
    try {
        const response = await axios.get(`https://statsapi.web.nhl.com/api/v1/teams/${req.params.team_id}`);
        res.json(response.data.teams[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while trying to fetch the team data.' });
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

app.listen(port, () => console.log(`App is running on http://localhost:${port}`));
