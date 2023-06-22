# Instructions for Running the Application

Make sure Node.js, Express, Axios, PostgreSQL, Mocha, and Supertest are all installed on your machine.

Ignore any React files. The original intention was to develop front-end components to make viewing the data easier, but ran out of time.

Replace the `user` and `password` fields in `dbConfig.js` with your own PostgreSQL user and password.

## Setting up the Database

1. Open a new terminal tab and navigate to the database directory: `sport-radar-app/src/database`.

2. Run the following command:
node createDb.js


3. Once the database is successfully created, run this command:
node createTables.js


4. Now, run the following command (replace `user` with your own user):
psql -h localhost -d nhl_stats -U user


## Starting the Server

1. Open an additional terminal tab and navigate to this directory: `sport-radar-app/src/nhl-api-server`.

2. Start the server by running the following command:
node server.js


3. Now open this URL in your browser: [http://localhost:8000/api/schedule?season=20172018](http://localhost:8000/api/schedule?season=20172018)

You can replace the season with any season of your choosing.

4. Navigate back to your first terminal tab, and you should be able to query the database (see the schema for the database below).

## Running Unit Tests

1. Open the following directory: `sport-radar-app` in your terminal.

2. Run the following command to run the unit tests:
mocha ./tests/test.js

## Database Schema
teams
----------
| id (PK) |   name   |
-----------------------

players
-----------------------------------------
| id (PK) |   name   | age | number | position | team_id (FK-teams.id) |
-------------------------------------------------------------------------

games
---------------------------------------------------
| id (PK) |     date     | home_team_id (FK-teams.id) | away_team_id (FK-teams.id) |
--------------------------------------------------------------------------

player_game_stats
-----------------------------------------------------------------------------------
| id (PK) | player_id (FK-players.id) | game_id (FK-games.id) | goals | assists | hits | points | penalty_minutes | opponent_team_id (FK-teams.id) |
------------------------------------------------------------------------------------------------------------------------------------------------------------

## Notes

1. Since the NHL season concluded, and there was no live data to ingest I made some modifications
2. First, my server.js takes in a season and ingests the data for the specified season
3. when ingesting the data I limited it to only ingest data on the first 5 match days to avoid making too many api calls 
4. The reason I included limit above is because my IP was being blocked for making too many api calls when trying to ingest a whole season's data
5. There were definitely some improvements that I could have made if given more time
6. The main 2 improvements that I could have made were to have more test coverage, and to further break up the server.js logic into smaller pieces
7. Lastly, I do not actually call scheduleMonitor.js anywhere in the code, but it is a psedo implementation of what I would have tried if there was live data available 

