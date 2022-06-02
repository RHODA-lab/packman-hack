'use strict';

var MongoClient = require('mongodb').MongoClient;
var config = require('./config');
var _db;

var Bindings = require('bindings');

    let b = Bindings.fromServiceBindingRoot()
    b = Bindings.filter(b, 'postgresql')
    if (b == undefined || b.length != 1) {
        console.log('Incorrect number of PostgreSQL drivers');
    }

    const u = Bindings.get(b[0], 'url')
    if (u == undefined) {
        console.log('No URL in binding');
    } else {
        console.log(u);
    }

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
