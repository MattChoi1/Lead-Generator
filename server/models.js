const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LOGDNA_DB = 'logdna';

var createdModifiedPlugin = function(schema, options) {
    schema.add({ _created: Date });
    schema.add({ _modified: Date });

    schema.pre('save', function(next) {
        var newdate = new Date();
        if (this.isNew) this._created = newdate;
        this._modified = newdate;
        next();
    });

    if (options && options.index) {
        schema.path('_created').index(options.index);
        schema.path('_modified').index(options.index);
    }
};

var ModelRegister = {};

/* Model Wrapping Object */
var Model = function(name, schema, indexes, db, opts) {
    this.name = name;
    this.schema = schema;
    this.indexes = indexes || [];
    db = db || LOGDNA_DB;
    opts = opts || {};
    // only add the model to the ModelRegister if it's not a dynamic collection
    if (!opts.dynamic && typeof db === 'string' && db.length > 0) {
        var register = ModelRegister[db] || [];
        register.push(this);
        ModelRegister[db] = register;
    }
};

Model.prototype.getModel = function(conn, collection, buildIndex) {
    var m = conn || mongoose; // Try to use the supplied mongoose connection to build the model from, otherwise fallback to mongoose default
    var s = this.schema;
    if (buildIndex && this.indexes.length > 0) {
        for (var i = 0, len = this.indexes.length, iArgs; i < len; i++) {
            iArgs = this.indexes[i];
            if (iArgs instanceof Array) {
                s.index.apply(s, iArgs);
            } else {
                s.index.call(s, iArgs);
            }
        }
    }
    return m.model(this.name, s, collection);
};

var DBModels = (function() {
    var oAuthProviderSchema = {
        email: String
      , accessToken: String
      , refreshToken: String
      , id: String
    };
    return {
        LeadsModel: new Model('Leads',
            new Schema({
              company: { type: String, required: true }
              , url: { type: String, required: true }
              , firstname: { type: String, trim: true }
              , lastname: { type: String, trim: true }
              , title: { type: String }
              , email: { type: String, required: true }
              , location: { type: String }
              , companySize: { type: String }
              , linkedin: { type: String }
              , twitter: { type: String }
              , facebook: { type: String }
              , status: { type: String }
            })
            .plugin(createdModifiedPlugin)
          , [
                [{ url: 1 }, { unique: true }]
              , [{ company: 1 }, { unique: true }]
              , [{ email: 1 }, { unique: true }]
            ]
          , LOGDNA_DB
        )
    };
})();

var getModelsForConnection = function(conn, opts) {
    opts = opts || {};
    if (conn && conn.name) {
        var models = {};
        var m_arr = ModelRegister[conn.name];
        if (!m_arr) {
            return models;
        }
        for (var i = m_arr.length - 1; i >= 0; i--) {
            models[m_arr[i].name] = m_arr[i].getModel(conn, null, opts.buildIndex);
        }
        return models;
    } else {
        throw new Error('getModelsForConnection() cannot accept an empty connection or a connection without a name!');
    }
};

module.exports = {
  // CRM_DB
  Leads: DBModels.LeadsModel

};
