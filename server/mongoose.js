const _ = require('lodash');
const mongoose = require('mongoose');

const SERVER_OPTIONS = {
    mongoOptions: {
        server: { poolSize: 3, socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000, socketTimeoutMS: 60000 } }
      , replset: { poolSize: 3, socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000, socketTimeoutMS: 60000 } }
      , promiseLibrary: require('bluebird')
    }
};

var createMongooseConnection = function(mongoOptions) {
    var mongoose = require('mongoose');
    var user, pass, host, qs;
    mongoOptions = mongoOptions || {};
    user = process.env.MGUSER;
    pass = process.env.MGPASS;
    host = process.env.MGHOST;
    qs = '?authSource=admin&ssl=true';
    if (!~host.indexOf('localhost')) {
        // non-dev
        qs += '&replicaSet=logdna';
    }
    var db = mongoOptions.db || 'logdna';
    delete mongoOptions.db;
    var connStr;
    if (!user || !pass) { // fallback for localhost, for production we should have these defined...
        connStr = 'mongodb://localhost/' + db;
    } else {
        connStr = 'mongodb://' + user + ':' + pass + '@' + host + '/' + db + qs;
    }
    var connection = mongoose.createConnection(connStr, _.defaults(mongoOptions, SERVER_OPTIONS.mongoOptions));
    connection.on('connected', function() {
        console.log('Connection string: ' + connStr);
        console.log('Mongoose connected to DB: ' + db);
    });
    connection.on('error', function(err) {
        console.log('Mongoose connection error');
        console.log('Mongoose connection string: ' + connStr);
    });
    connection.on('disconnected', function() {
        console.log('Mongoose disconnected @ ' + (+new Date()), 'w');
    });
    connection.db.serverConfig.on('left', function(err, server) {
        console.log('Mongoose disconnected: ' + ((server || {}).internalMaster ? 'master' : 'slave') + ' ' + (server || {}).name, 'w');
    });
    return connection;
};

/* Module Exports */
module.exports = {
  createMongooseConnection: createMongooseConnection
  , get SERVER_OPTIONS() {
      return SERVER_OPTIONS;
  }
};
