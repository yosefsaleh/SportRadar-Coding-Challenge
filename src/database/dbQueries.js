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



module.exports = { storeGameData, storeTeamData };

