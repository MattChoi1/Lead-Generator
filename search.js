const async = require('async');

const clearbitEnrich = require('clearbit')(process.env.clearbitAPI);
const clearbitProspect = require('clearbit')(process.env.clearbitAPI);
const _ = require('lodash');
const mongoo = require('./mongo.js');
var companyDomain;
var i = 0;

var small = [ // 1-10
    {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'executive'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'VP'
        , limit: 1
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Head'
        , limit: 1
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , limit: 2
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager' // prospector 1500/month
        , limit: 2
    }
]; // search order: CTO, VP of Eng, Head of Eng, general director search, general manager search
// fallback limits: 2

var small_medium = [ // 11-50
    {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'executive'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'VP'
        , limit: 1
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Head'
        , limit: 1
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'Infrastructure'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'Platform'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'Site Reliability'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'Systems'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'DevOps'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , title: 'Infrastructure'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , title: 'Platform'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , title: 'Site Reliability'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , title: 'Systems'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , title: 'DevOps'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , limit: 2
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , limit: 2
    }
]; //search order: CTO, VP of Eng, Head of Eng, Infra/DevOps/Platform/Systems/SR director, Infra/DevOps/Platform/Systems/SR manager, general fallbacks
//limit for fallbacks: 2

var medium = [ // 51 - 250
    {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Head'
        , limit: 1
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'VP'
        , limit: 1
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'director of engineering'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'Infrastructure'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'Site Reliability'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'Platform'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'Systems'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'DevOps'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'Platform'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , title: 'Infrastructure'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , title: 'Site Reliability'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , title: 'Platform'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , title: 'Systems'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , title: 'DevOps'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'executive'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , limit: 3
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , limit: 3
    }
]; // search order: VP of eng, Head of Eng, director of engineering, DevOps/Infra/Systems/SR/Platform director, - manager, CTO, general fallbacks
 // fallback limits: 3

var medium_large = [ // 251 - 1000
    {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Head of Infrastructure'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Head of Site Reliability'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Head of Platform'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Head of Systems'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Head of DevOps'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'VP of Infrastructure'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'VP of Site Reliability'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'VP of Platform'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'VP of Systems'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'VP of DevOps'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Head of Engineering'
        , limit: 1
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'VP of Engineering'
        , limit: 1
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'Infrastructure'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'Site Reliability'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'Platform'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'Systems'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'DevOps'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'Platform'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'director of engineering'
        , limit: 2
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , title: 'Infrastructure'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , title: 'Site Reliability'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , title: 'Platform'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , title: 'Systems'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , title: 'DevOps'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Tech Lead'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Technical Lead'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Team Lead'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Infrastructure Lead'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Site Reliability Lead'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Platform Lead'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Systems Lead'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'DevOps Lead'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Lead Infrastructure'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Lead Site Reliability'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Lead Platform'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Lead Systems'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Lead DevOps'
    }
    ,{
        domain: companyDomain
        , role: "engineering"
        , title: "lead"
        , limit: 1
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , limit: 3
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , limit: 3
    }
];//search order: Head of Infra/DevOps/SR/Platform/Systems, VP of -, Head of Eng, VP of Eng, Infra/DevOps/SR/Platform/Systems director, director of eng, - manager, - lead, lead -, general leads search, fallbacks
//limit for fallbacks: 3
//limit for lead search: 1
//limit for director of eng: 2

var large = [
    {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Head of Infrastructure'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Head of Site Reliability'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Head of Platform'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Head of Systems'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Head of DevOps'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'VP of Infrastructure'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'VP of Site Reliability'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'VP of Platform'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'VP of Systems'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'VP of DevOps'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Head of Engineering'
        , limit: 1
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'VP of Engineering'
        , limit: 1
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'Infrastructure'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'Site Reliability'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'Platform'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'Systems'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'DevOps'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'Platform'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , title: 'director of engineering'
        , limit: 2
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , title: 'Infrastructure'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , title: 'Site Reliability'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , title: 'Platform'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , title: 'Systems'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , title: 'DevOps'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Tech Lead'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Technical Lead'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Team Lead'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Infrastructure Lead'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Site Reliability Lead'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Platform Lead'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Systems Lead'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'DevOps Lead'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Lead Infrastructure'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Lead Site Reliability'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Lead Platform'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Lead Systems'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Lead DevOps'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Senior Infrastructure'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Senior Site Reliability'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Senior Platform'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Senior Systems'
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , title: 'Senior DevOps'
    }
    ,{
        domain: companyDomain
        , role: "engineering"
        , title: "lead"
        , limit: 2
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'director'
        , limit: 4
    }
    , {
        domain: companyDomain
        , role: 'engineering'
        , seniority: 'manager'
        , limit: 4
    }
];
//search order: Head of Infra/DevOps/SR/Platform/Systems, VP of -, Head of Eng, VP of Eng, Infra/DevOps/SR/Platform/Systems director, director of eng, - manager, - lead, lead -, senior -, general lead search, fallbacks

var small_stop = 2;
var small_medium_stop = 3;
var medium_stop = 4;
var medium_large_stop = 5;
var large_stop = 6;
var stop;

/*
var extraInfo = function (prospectemail, callback) { // finding linkedin and twitters
    console.log('prospectemail: ' +prospectemail);
    clearbitEnrich.Person.find({email: prospectemail, timeout: 30000}) // using enrichment api to find extra stuff
    .then(function (person) {
        var linkedin;
        var twitter;
        var facebook;
        var personalWebsite;
        var extraInfoJSON = {};

        if (person.linkedin.handle) { extraInfoJSON.linkedin = 'linkedin.com/' + person.linkedin.handle }
        if (person.facebook.handle) { extraInfoJSON.facebook = 'facebook.com/' + person.facebook.handle }
        if (person.twitter.handle) { extraInfoJSON.twitter = 'twitter.com/' + person.twitter.handle }

        return callback(null, extraInfoJSON);
    })
    .catch(function(err) {
        var error = JSON.stringify(err);
        if (error.indexOf('socket') != -1) {
            console.log('calling again!');
            extraInfo(prospectemail, callback);
        }
        else {
            return callback(err);
        }
        // console.log('why error');
        // console.log('Error: %j', err);
        // return callback(err);
    });
};*/

var basicInfo = function (person) { // getting basic info about people (name, email, title, verified)
    var basicInfoJSON = {};
    basicInfoJSON.firstname = person.name.givenName;
    basicInfoJSON.lastname = person.name.familyName;
    basicInfoJSON.email = person.email;
    basicInfoJSON.title = person.title;
    basicInfoJSON.validemail = person.verified;
    return basicInfoJSON; // parsing information
};



function processIndividuals(payload, person, index, callback) {
    console.log('person: ' + person);
    if (!payload.emailcache.includes(person.email) && person.title.indexOf('Strategy') === -1 && person.title.indexOf('Consultant') === -1) {
        payload.emailcache.push(person.email);
        var basicInfoJSON = basicInfo(person);
        /*
        if (payload.findextrainfo) {
            extraInfo(basicInfoJSON.email, function(err, extraInfoJSON) { // getting extra info (Facebook, Linkedin, Twitter)
                if (err) {
                    return callback(err);
                } else {
                    console.log('ExtraInfo: %j', JSON.stringify(extraInfoJSON));
                    var combinedJSON = _.merge(basicInfoJSON, extraInfoJSON);
                    payload.result.push(combinedJSON);
                    return callback(null, payload);
                }
            });
        } else {*/
        payload.result.push(basicInfoJSON); // if there's nothing, put basic info into the payload
        return callback(null, payload);
        // }
    } else {
        return callback(null, payload);
    }
}

function clearBitAPI(payload, filter, callback) { // pinging prospector api
    if (payload.currentCount <= payload.stop && filter) {
        filter.domain = payload.url;
        filter.timeout = 30000;
        clearbitProspect.Prospector.search(filter)
        .then(function(people) {
            payload.currentCount += people.length; // getting the current count and adding the number of people searched through prospector
            //console.log('currentcount: ' + payload.currentCount);
            payload.total = (payload.total).concat(people);
            return callback(null, payload);
        })
        .catch(function(err) {
            var error = JSON.stringify(err);
            if (error.indexOf('socket') != -1) {
                console.log('calling clearbitapi again!');
                clearBitAPI(payload, filter, callback);
            }
            else {
                console.log('what is this claerbitapi error: ' + err);
                return callback(err);
            }
        });
    } else {
        console.log('oops');
        return callback(null, payload);
    }
}

function go(filterArray, payload, callback) { // pings clearbit and then proccessing individuals once getting a batch of people
    async.eachSeries(filterArray, clearBitAPI.bind(clearBitAPI, payload), function(err) {
        if (err) {
            return callback(err);
        }
        console.log('done filtering!');
        async.transform(payload.total, payload, processIndividuals, function(err, result) {
            delete result.total;
            console.log('done finding info!');
            return callback(null, result);
        });
    });
}


var findLeads = function(payload, callback) {
    // console.log('payload man: ' + payload.companyDetails['size']);
    var size = payload.companyDetails['size'];

    if (payload.specificPerson) {
        var custom_filter = [{
            domain: payload.url
            , name: payload.specificPerson
            , limit: payload.stop || 3 // Get max of 3 people with the same name
            // In case there are people with the same names, default limit to 3 people.
        }];
        payload.stop = 1; // Search once => max 3 people
        return go(custom_filter, payload, callback);
    }

    if (size === '1000+') { // Large Company
        if (!payload.stop) { payload.stop = large_stop; }
        go(large, payload, callback);
    } else if (size === '251-1000') { // Medium Company
        if (!payload.stop) { payload.stop = medium_large_stop; }
        go(medium_large, payload, callback);
    } else if (size === '51-250') {
        if (!payload.stop) { payload.stop = medium_stop; }
        go(medium, payload, callback);
    } else if (size === '11-50') {
        if (!payload.stop) { payload.stop = small_medium_stop; }
        go(small_medium, payload, callback);
    } else { // Small Company
        if (!payload.stop) { payload.stop = small_stop; }
        go(small, payload, callback);
    }
};



exports.search = function(company, callback) {
    var name = company.company;
    var url = company.url; // URL
    var size = company.size; // SIZE
    var extra = company.extra; // want LINKEDIN FACEBOOK TWITTER?
    var address = company.address;
    var specificPerson = company.specificPerson;
    var customLimit = company.limit;

    if (url) {
        mongoo.getAndUpdate(url, function(err, doc){ // first doing a check if the company exists in mongo or not
            if (doc) {
                return callback(null, doc); // if it exists, returns all the leads for that company and displays it
            }
            else { // if it doesn't, it runs a clearbit search
                var result = [];
                var emailcache = [];
                var companyDetails = {};
                var payload = {
                    total: []
                    , result: result
                    , currentCount: 1
                    , emailcache: emailcache
                    , companyDetails: companyDetails
                    , stop: (!(customLimit === 'null' || customLimit === 0 || customLimit==="") ? customLimit : undefined)
                    , url: url.toString()
                    , findextrainfo: (extra || false)
                    , specificPerson: (specificPerson || null)
                };
                if (size) {         // If size exists in imported csv, dont call clearbit Enrich API
                // This synchronizes clearbit company size format with crunchbase company size format
                if (size === '51-100') {
                    size = '51-250';
                } else if (size === '101-250') {
                    size = '51-250';
                } else if (size === '251-500') {
                    size = '251-500';
                } else if (size === '501-1000') {
                    size = '251-1000';
                } else if (size === '1001-5000' || size === '5001-10000' || size === '10000+') {
                    size = '1000+';
                } else if (size === 'Nov-50') {
                    size = '11-50';
                }

                payload.companyDetails.size = size;
                payload.companyDetails.address = address;
                payload.companyDetails.url = url;
                payload.companyDetails.company = name;
                findLeads(payload, function(err, resulty) {
                    console.log('resulty: ' + JSON.stringify(resulty, null, 2));
                    mongoo.create(resulty, callback);
                    // return callback(err, resulty);
                });

                } else {
                    clearbitEnrich.Company.find({ domain: payload.url, timeout: 30000 }) // getting company size and other information about a company
                    .then(function(company) {
                    payload.companyDetails.size = company.metrics.employeesRange;
                    payload.companyDetails.address = (company.geo.streetNumber || '') + ' ' + (company.geo.streetName || '') + ' ' + (company.geo.city || '') + ' ' + (company.geo.state || '') + ' ' + (company.geo.postalCode || '');
                    payload.companyDetails.url = company.domain;
                    payload.companyDetails.company = company.legalName || company.name;
                    console.log('Company Size: ' + payload.size);
                    console.log('Payload: ' + JSON.stringify(payload));
                    findLeads(payload, function(err, resulty) {
                        console.log('resulty: ' + JSON.stringify(resulty, null, 2));
                        mongoo.create(resulty, callback);

                         // return callback(err, resulty);
                        });
                    });
                }
            }
        });
    }
};








