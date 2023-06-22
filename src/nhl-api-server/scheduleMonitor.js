const axios = require('axios');
const cron = require('node-cron');

let gameCrons = {};  // Keep track of the active games and their respective cron jobs

const startScheduleMonitoring = () => {
    cron.schedule('*/5 * * * *', async () => { // Schedule API check every 5 minutes
        try {
            const response = await axios.get('https://statsapi.web.nhl.com/api/v1/schedule');
            const games = response.data.dates[0].games;
            for (let game of games) {
                if (game.status.abstractGameState === 'Live' && !gameCrons.hasOwnProperty(game.gamePk)) {
                    // New live game detected, start a cron job to monitor it
                    gameCrons[game.gamePk] = cron.schedule('*/1 * * * *', async () => {
                        try {
                            const boxscoreResponse = await axios.get(`https://statsapi.web.nhl.com/api/v1/game/${game.gamePk}/boxscore`);
                            if (boxscoreResponse.data.status.abstractGameState === 'Final') {
                                // If the game is over, stop the cron job and remove it from gameCrons
                                gameCrons[game.gamePk].stop();
                                delete gameCrons[game.gamePk];
                            } else {
                                // If the game is still live, update the player stats
                                const players = boxscoreResponse.data.teams.home.players;
                                Object.values(players).forEach(player => {
                                    const stats = player.stats.skaterStats;
                                    console.log({
                                        personId: player.person.id,
                                        fullName: player.person.fullName,
                                        goals: stats.goals,
                                        assists: stats.assists,
                                        hits: stats.hits,
                                        points: stats.goals + stats.assists,
                                        penaltyMinutes: stats.penaltyMinutes
                                    });
                                    // push updated stats to database would occur here
                                });
                            }
                        } catch (error) {
                            console.error(error);
                        }
                    });
                }
            }
        } catch (error) {
            console.error(error);
        }
    });
};

module.exports = startScheduleMonitoring;
