# Instructions for running the application

make sure node, express, axios, postgres, mocha, and supertest are all installed on your machine
ignore any React files. Original intention was to develop front end components to make viewing the data easier, but ran out of time
replace user and password fields in dbConfig.js with your own postgres user and password
open a new terminal tab, and navigate to the database directory: sport-radar-app/src/database
run the following command node createDb.js
once the db is successfully created run this command node createTables.js
now run this command and replace user with your own user: psql -h localhost -d nhl_stats -U yoyosef
open an additional terminal tab, and navigate to this directory: sport-radar-app/src/nhl-api-server
start the server by running node server.js
now open this url in your browser: http://localhost:8000/api/schedule?season=20172018
you can replace the season with any season of your choosing 
navigate back to your first terminal tab, and you should be able to query the database (see the schema for the db below)
to run unit tests open the following directory: sport-radar-app
run this command to run the unit tests: mocha ./__tests__/test.js

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


