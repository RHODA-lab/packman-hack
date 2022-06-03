'use strict';

var MongoClient = require('mongodb').MongoClient;
var config = require('./config');
var _db;

const assert = require('assert');
const path = require('path');
const { after, before, describe, it } = require('mocha');
const bindings = require('../../index.js');

console.log("hjhjhjhjhjhjhjh");
describe('test-postgresql-bindings', () => {
  let env;
  before(() => {
    env = process.env;
    process.env = { SERVICE_BINDING_ROOT: path.join(__dirname, 'bindings') };
  });

  it('test-postgres-pg', () => {
    const binding = bindings.getBinding('POSTGRESQL', 'pg');
    assert(binding);
    assert.deepEqual(binding, {
      database: 'db1',
      host: '127.0.0.1',
      password: 'p1',
      port: '1234',
      type: 'postgresql',
      user: 'michael',
      ssl: {
        ca: '----BEGIN CERTIFICATE-----\n1234\n-----END CERTIFICATE-----',
        cert: '-----BEGIN CERTIFICATE-----\nABCD\n-----END CERTIFICATE-----',
        key: '-----BEGIN CERTIFICATE-----\nXYZ\n-----END CERTIFICATE-----'
      }
    });
  });

  after(() => {
    process.env = env;
  });
});

console.log("nmnmnmnmnmnmnmn");

function Database() {
    this.connect = function(app, callback) {
            MongoClient.connect(config.database.url,
                                config.database.options,
                                function (err, db) {
                                    if (err) {
                                        console.log(err);
                                        console.log(config.database.url);
                                        console.log(config.database.options);
                                    } else {
                                        _db = db;
                                        app.locals.db = db;
                                    }
                                    callback(err);
                                });
    }

    this.getDb = function(app, callback) {
        if (!_db) {
            this.connect(app, function(err) {
                if (err) {
                    console.log('Failed to connect to database server');
                } else {
                    console.log('Connected to database server successfully');
                }

                callback(err, _db);
            });
        } else {
            callback(null, _db);
        }

    }
}

module.exports = exports = new Database(); // Singleton
