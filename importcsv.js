const csvFilePath = __dirname + '/testingcsv.csv';
const csv = require('csvtojson');
const clearbit = require('./search.js');
const tocsv = require('./exportcsv.js');
const async = require('async');
const _ = require('lodash');
const urlparse = require('url-parse');


var companies = [];


exports.getWebsites = function(csvstring, callback) { // get websites from CSV
    var string = csvstring;
    csv()
    .fromString(string || 'hello')
    .on('json', (jsonObj)=>{
        // combine csv header row and csv line to a json object
        // jsonObj.a ==> 1 or 4
        var url = jsonObj['Websites'] || jsonObj['Website']; // parsing the imported csv and getting objects
        url = urlparse(url).hostname.replace('www.','');
        var size = jsonObj['Number of Employees'] || jsonObj['Company Size'];
        var extrainfo = jsonObj['Extra'];
        var companylocation = jsonObj['Headquarters Location'] || jsonObj['Location'];
        var companyname = jsonObj['Company Name'] || jsonObj['Company'];

        var company = {};
        company.company = companyname;
        company.url = url;
        company.size = size;
        company.extrainfo = extrainfo;
        company.address = companylocation;
        company.extra = true;

        if (url) {
            companies.push(company);
        }

        //console.log('each company: ' + company);
    })
    .on('done', (error)=>{
        console.log('Companies: ' + companies);
        if (error) {
           console.log('Error occured converting from csv to json: ' + error);
        }
        start(companies, function(err, result) {
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    });
};

function start(companies, callback) { // start sending things to search.js to get results (whether from mongo or clearbit)
    //console.log('list of companies bro: ' + JSON.stringify(companies, null, 2));
    async.map(companies, clearbit.search, function(err, core) { //result is now core
        if (err) {
            console.log('Error: %j', err);
            return callback(err);
        }
        var unique = [];
        // formatting the data to use with the table display
        for (var i = 0; i < core.length; i++) {
            var company = core[i];
            if (!unique.includes(company)) {
                unique.push(company);
            }
        }
        callback(null, unique);
    });
}


