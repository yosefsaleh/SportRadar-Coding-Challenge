const express = require('express');
const axios = require('axios');
const app = express();
const port = 8000;
const { storeGameData, storeTeamData, storePlayerData, storePlayerGameStats } = require('../database/dbQueries');
const startScheduleMonitoring = require('./scheduleMonitor');

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

app.get('/api/people/:person_id/stats/:season', async (req, res) => {
    try {
        const response = await axios.get(`https://statsapi.web.nhl.com/api/v1/people/${req.params.person_id}/stats?stats=statsSingleSeason&season=${req.params.season}`);

        const data = response.data.stats[0].splits[0].stat;

        const result = {
            Assists: data.assists,
            Goals: data.goals,
            Hits: data.hits,
            Points: data.points,
            PenaltyMinutes: data.penaltyMinutes
        };

        console.log(result);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while trying to fetch the person\'s stats.' });
    }
});

app.get('/api/schedule', async (req, res) => {
    const season = req.query.season;  // Extract the 'season' query parameter from the request
    let playerStats = [];
    try {
        const response = await axios.get(`https://statsapi.web.nhl.com/api/v1/schedule?season=${season}`);
        const dates = response.data.dates;
        for (let date of dates.slice(0, 5)) { // get only the first 5 games
            const games = date.games;
            for (let game of games) {
                await storeTeamData(game.teams.home.team);
                await storeTeamData(game.teams.away.team);
                await storeGameData(game);
                const boxscoreResponse = await axios.get(`https://statsapi.web.nhl.com/api/v1/game/${game.gamePk}/boxscore`);
                const players = { ...boxscoreResponse.data.teams.home.players, ...boxscoreResponse.data.teams.away.players };
                Object.values(players).forEach(async (player) => {
                    if (player.stats && player.stats.skaterStats) { // check if stats exist for the player
                        const stats = player.stats.skaterStats;
                        const opponent_team_id = player.person.currentTeam ? 
                         (game.teams.home.team.id === player.person.currentTeam.id ? 
                          game.teams.away.team.id : 
                          game.teams.home.team.id) : "undefined";

                        const playerData = {
                            id: player.person.id,
                            name: player.person.fullName,
                            age: player.person.currentAge,
                            number: player.jerseyNumber,
                            position: player.position.code,
                            team_id: player.person.currentTeam ? player.person.currentTeam.id : "undefined",
                        };
                        
                        await storePlayerData(playerData, playerData.team_id, player.person.currentTeam ? player.person.currentTeam.name : "undefined");
                        await storePlayerGameStats(player.person.id, game.gamePk, stats, opponent_team_id);
                        
                        playerStats.push({
                            ...playerData,
                            goals: stats.goals,
                            assists: stats.assists,
                            hits: stats.hits,
                            points: stats.goals + stats.assists,
                            penalty_minutes: stats.penaltyMinutes,
                            opponent_team_id: opponent_team_id
                        });
                    }
                });
            }
        }
        res.json(playerStats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while trying to fetch the schedule.' });
    }
});



app.listen(port, () => {
    console.log(`App is running on http://localhost:${port}`);
    //startScheduleMonitoring();
});