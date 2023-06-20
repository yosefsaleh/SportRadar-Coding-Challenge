const pgp = require('pg-promise')();

const cn = {
    host: 'localhost',
    port: 5432, 
    database: 'postgres',
    user: 'yoyosef',
    password: ''
};

const db = pgp(cn);

db.query('CREATE DATABASE nhl_stats')
    .then(() => {
        console.log('Database created successfully');
    })
    .catch(error => console.error('Error creating database', error))
    .finally(pgp.end);
