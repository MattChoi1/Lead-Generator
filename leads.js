exports.init = function(Leads) { // functions to use for mongo
    // create an object in mongo
    exports.create = function(company, url, keyURL, reason, firstname, lastname, title, email, linkedin, twitter, facebook, location, companySize, status, callback) {
        if (!email || typeof email !== 'string') {
            return callback('Error: new lead MUST have an email string');
        }
        // if (!company || typeof company !== 'string') {
        //     return callback('Error: new lead MUST have an company string');
        // }
        // putting the inputted data in the right format
        var newLead = {
            company: company
            , url: url
            , keyURL: keyURL
            , reason: reason
            , firstname: firstname
            , lastname: lastname
            , title: title
            , email: email
            , location: location
            , companySize: companySize
            , linkedin: linkedin
            , twitter: twitter
            , facebook: facebook
            , status: status
        };
        //making a mongo call
        Leads.update({email: email}, newLead, {upsert: true}, function(err, doc) {
            if (err) {
                return callback('Error: Mongo could not create lead. Details:' + JSON.stringify(err));
            }
            return callback(null, doc);
        });
    };
    // do a check on mongo
    exports.get = function(query, callback) {
        Leads.find(query).lean().exec(function(err, doc) {
            if (err || !doc || doc.length === 0) {
                return callback('Leads not found!');
            }
            return callback && callback(null, doc);
        });
    };
    // update the result from mongo
    exports.update = function(query, update, callback) {
        Leads.findOneAndUpdate(query, update, function(err, doc) {
            if (err || !doc || doc.length === 0) {
                return callback('Leads not found!');
            }
            return callback && callback(null, doc);
        });
    };

};
