const request = require('supertest');
const { expect } = require('chai');
const app = require('../src/nhl-api-server/endpointHandlers.js');

describe('GET /api/schedule', function() {
    this.timeout(10000);  
  
    it('should respond with status code 200', function(done) {
      request(app)
        .get('/api/schedule')
        .query({ season: '20222023', numGames: 1 })
        .expect(200, done);
    });
  });

  describe('GET /api/game/:game_id/boxscore', function() {
    this.timeout(10000); 
  
    it('should respond with status code 200', function(done) {
      const gameId = '2017021000'; 
      request(app)
        .get(`/api/game/${gameId}/boxscore`)
        .expect(200, done);
    });
  });


  
