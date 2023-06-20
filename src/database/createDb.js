const pgp = require('pg-promise')();
const dbConfig = require('./dbConfig');

// Connect to the PostgreSQL server
const db = pgp({
  ...dbConfig,
  database: "postgres"  // Connect to the default 'postgres' database to be able to create a new one
});

const createDatabase = async () => {
  try {
    // Try to drop the database if it exists 
    await db.none(`DROP DATABASE IF EXISTS ${dbConfig.database}`);

    // Create a new database
    await db.none(`CREATE DATABASE ${dbConfig.database}`);

    console.log(`Database '${dbConfig.database}' created successfully`);
  } catch (err) {
    console.error(`Error creating database '${dbConfig.database}'`, err);
  } finally {
    pgp.end();  // Close the connection pool
  }
};

createDatabase();

