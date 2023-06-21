const pgp = require('pg-promise')();

const { dbConfig } = require('./dbConfig');

const dropDbConfig = {
    ...dbConfig,
    database: 'postgres', // Connect to a different database before dropping the target one
};

const db = pgp(dropDbConfig);

async function createDb() {
    try {
        await db.none(`DROP DATABASE IF EXISTS ${dbConfig.database}`);
        console.log('Existing database dropped successfully!');
        
        await db.none(`CREATE DATABASE ${dbConfig.database}`);
        console.log('Database created successfully!');
    } catch (error) {
        console.error(`Error creating database: ${error}`);
    }
}

createDb();
