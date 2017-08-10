const _ = require('lodash');
const async = require('async');


var createMongooseConnection = function(mongoOptions) {
    var mongoose = require('mongoose');
    var user, pass, host, qs;
    mongoOptions = mongoOptions || {};
    user = process.env.MGUSER;
    pass = process.env.MGPASS;
    qs = '?authSource=admin&ssl=true';
    if (!~host.indexOf('localhost')) {
        // non-dev
        qs += '&replicaSet=logdna';
    }
    if (!production && mongoOptions.debug) {
        mongoose.set('debug', true);
        delete mongoOptions.debug; // Remove it from the options object
    }
    var db = mongoOptions.db || DEFAULT_DB;
    delete mongoOptions.db;
    var connStr;
    if (!user || !pass) { // fallback for localhost, for production we should have these defined...
        connStr = 'mongodb://localhost/' + db;
    } else {
        connStr = 'mongodb://' + user + ':' + pass + '@' + host + '/' + db + qs;
    }
    var connection = mongoose.createConnection(connStr, _.defaults(mongoOptions, SERVER_OPTIONS.mongoOptions));
    connection.on('connected', function() {
        logger.print('Mongoose connected to DB: ' + db);
    });
    connection.on('error', function(err) {
        logger.print('Mongoose connection error: ' + util.inspect(err), 'e');
        logger.print('Mongoose connection string: ' + connStr);
    });
    connection.on('disconnected', function() {
        logger.print('Mongoose disconnected @ ' + (+new Date()), 'w');
    });
    connection.db.serverConfig.on('left', function(err, server) {
        logger.print('Mongoose disconnected: ' + ((server || {}).internalMaster ? 'master' : 'slave') + ' ' + (server || {}).name, 'w');
    });
    return connection;
};

/* Module Exports */
module.exports = {
  createMongooseConnection: createMongooseConnection
};
