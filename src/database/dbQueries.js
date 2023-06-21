const pgp = require('pg-promise')();
const {dbConfig} = require('./dbConfig');
const db = pgp(dbConfig);

async function storeGameData(game) {
    try {
        const game_date = game.gameDate;
        const home_team_id = game.teams.home.team.id;
        const away_team_id = game.teams.away.team.id;
        const gamePk = game.gamePk;
        
        const queryText = 'INSERT INTO games(id, date, home_team_id, away_team_id) VALUES($1, $2, $3, $4)';
        const values = [gamePk, game_date, home_team_id, away_team_id];

        await db.none(queryText, values);

    } catch (error) {
        console.error(`Error storing game data: ${error}`);
    }
}

async function storeTeamData(team) {
    try {
        const team_id = team.id;
        const team_name = team.name;
        
        const queryText = 'INSERT INTO teams(id, name) VALUES($1, $2) ON CONFLICT (id) DO NOTHING';
        const values = [team_id, team_name];

        await db.none(queryText, values);

    } catch (error) {
        console.error(`Error storing team data: ${error}`);
    }
}

async function storePlayerData(playerData) {
    try {
        // Check if team_id is not "undefined"
        if (playerData.team_id !== "undefined") {
            const playerExists = await db.oneOrNone('SELECT id FROM players WHERE id = $1', [playerData.id]);

            if (!playerExists) {
                const queryText = 'INSERT INTO players(id, name, age, number, position, team_id) VALUES($1, $2, $3, $4, $5, $6)';
                const values = [playerData.id, playerData.name, playerData.age, playerData.number, playerData.position, playerData.team_id];

                await db.none(queryText, values);
            }
        } else {
            console.log(`Player with ID: ${playerData.id} has an undefined team_id`);
        }
    } catch (error) {
        console.error(`Error storing player data: ${error}`);
    }
}



async function storePlayerGameStats(player_id, game_id, stats, opponent_team_id) {
    if (!opponent_team_id || opponent_team_id === "undefined") {
        console.log("Player game stats not stored due to undefined field:", stats);
        return;
    }
    
    try {
        const queryText = 'INSERT INTO player_game_stats(player_id, game_id, goals, assists, hits, points, penalty_minutes, opponent_team_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8)';
        const values = [player_id, game_id, stats.goals, stats.assists, stats.hits, stats.goals + stats.assists, stats.penaltyMinutes, opponent_team_id];

        await db.none(queryText, values);
    } catch (error) {
        console.error(`Error storing player game stats: ${error}`);
    }
}

module.exports = {
    storeTeamData,
    storeGameData,
    storePlayerData,
    storePlayerGameStats
};

