exports.init = function(Leads) {

    exports.create = function(company, url, keyURL, firstname, lastname, title, email, linkedin, twitter, facebook, location, companySize, status, callback) {
        if (!email || typeof email !== 'string') {
            return callback('Error: new lead MUST have an email string');
        }
        // if (!company || typeof company !== 'string') {
        //     return callback('Error: new lead MUST have an company string');
        // }
        var newLead = {
            company: company
            , url: url
            , keyURL: keyURL || 'N/A'
            , firstname: firstname || 'N/A'
            , lastname: lastname || 'N/A'
            , title: title || 'N/A'
            , email: email
            , location: location || 'N/A'
            , companySize: companySize || 'N/A'
            , linkedin: linkedin || 'N/A'
            , twitter: twitter || 'N/A'
            , facebook: facebook || 'N/A'
            , status: status || 'N/A'
        };
        Leads.update({upsert: true}, newLead, function(err, doc) {
            if (err) {
                return callback('Error: Mongo could not create lead. Details:' + JSON.stringify(err));
            }
            return callback(null, doc);
        });
    };

    exports.get = function(query, select, callback) {
        Leads.findOne(query).select(select).lean().exec(function(err, doc) {
            if (err || !doc) {
                return callback('Leads not found!');
            }
            return callback && callback(null, doc);
        });
    };

    exports.update = function(query, update, callback) {
        Leads.findOneAndUpdate(query, update, function(err, doc) {
            if (err || !doc) {
                return callback('Leads not found!');
            }
            return callback && callback(null, doc);
        });
    };

};
