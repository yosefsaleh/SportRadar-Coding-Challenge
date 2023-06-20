const pgp = require('pg-promise')();
const dbConfig = require('./dbConfig');

const db = pgp(dbConfig);

const createTables = async () => {
  try {
    await db.none(`
      CREATE TABLE IF NOT EXISTS teams (
        id INT PRIMARY KEY,
        name VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS players (
        id INT PRIMARY KEY,
        name VARCHAR(255),
        age INT,
        number INT,
        position VARCHAR(255),
        team_id INT REFERENCES teams(id)
      );

      CREATE TABLE IF NOT EXISTS games (
        id INT PRIMARY KEY,
        date DATE,
        home_team_id INT REFERENCES teams(id),
        away_team_id INT REFERENCES teams(id)
      );

      CREATE TABLE IF NOT EXISTS player_game_stats (
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
    `);

    console.log("Tables created successfully");
  } catch (err) {
    console.error("Error creating tables", err);
  } finally {
    pgp.end(); // Close the connection pool
  }
};

createTables();
