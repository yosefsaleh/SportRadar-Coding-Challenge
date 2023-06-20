const pgp = require('pg-promise')();

const cn = {
    host: 'localhost',
    port: 5432,
    database: 'nhl_stats',
    user: 'yoyosef', // should use your own username here
    password: '' // should replace with your own password
};

const db = pgp(cn);

const createTables = `
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    age INT,
    number INT,
    position VARCHAR(255),
    team_id INT REFERENCES teams(id)
);

CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    date DATE,
    home_team_id INT REFERENCES teams(id),
    away_team_id INT REFERENCES teams(id)
);

CREATE TABLE player_game_stats (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES players(id),
    game_id INT REFERENCES games(id),
    goals INT,
    assists INT,
    hits INT,
    points INT,
    penalty_minutes INT,
    opponent_team_id INT REFERENCES teams(id)
);
`;

db.none(createTables)
    .then(() => {
        console.log('Tables created successfully');
    })
    .catch(error => console.error('Error creating tables', error))
    .finally(pgp.end);
