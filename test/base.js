let _ = require('lodash');
let assert = require('assert');
let express = require('express');
let request = require('supertest');
const msgpack = require('msgpack-lite');


let middleware = require('../index.js');

let app = null;
let sample_json = {"da test": "worked"};
let sample_encoded = msgpack.encode(sample_json);
let sample_encoded_size = _.size(sample_encoded);

describe('Base Functionality', function() {
  before(function() {
    app = express();

    app.use(middleware({auto_detect: true}));
    app.get('/test_json', function(req, res) {
	    res.status(200).json(sample_json);
    });
    app.get('/test_msgpack', function(req, res) {
      res.status(200).msgPack(sample_json);
    });    
  });

  describe('#Demo App Test Requests (auto-detect JSON)', function() {
    it('Count Encoded Message Bytes', function(done) {
      request(app)
        .get('/test_json')
        .set('Accept', 'application/x-msgpack')
        .expect('Content-Type', /msgpack/)
        .expect(200)
        .end(function(err, res) {
          assert.ifError(err);
          let response_size = _.size(res.text);
          assert.equal(sample_encoded_size, response_size, `Response size is not correct (${sample_encoded_size} != ${response_size})`);
          done();
        });
      
    });

    it('Check Decoded Response Structure', function(done) {
      request(app)        
        .get('/test_json')
        .set('Accept', 'application/x-msgpack')
        .expect('Content-Type', /msgpack/)
        .expect(200)
        .end(function(err, res) {
          assert.ifError(err);
          done();
        });
    });
  });

  describe('#Demo App Test Requests (msgPack() extension method)', function() {
    it('Count Encoded Message Bytes', function(done) {
      request(app)        
        .get('/test_msgpack')
        .set('Accept', 'application/x-msgpack')
        .expect('Content-Type', /msgpack/)
        .expect(200)
        .end(function(err, res) {
          assert.ifError(err);
          let response_size = _.size(res.text);          
          assert.equal(sample_encoded_size, response_size, `Response size is not correct (${sample_encoded_size} != ${response_size})`);          
          done();
        });
    });

    it('Check Decoded Response Structure', function(done) {
      request(app)              
        .get('/test_msgpack')
        .set('Accept', 'application/x-msgpack')
        .expect('Content-Type', /msgpack/)
        .expect(200)
        .end(function(err, res) {
          assert.ifError(err);
          done();
        });
    });    
  });
});
