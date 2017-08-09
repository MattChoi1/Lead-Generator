const csvFilePath = __dirname + '/testingcsv.csv';
const csv = require('csvtojson');
const clearbit = require('./search.js');
const tocsv = require('./exportcsv.js');
const async = require('async');
const _ = require('lodash');

// Database Connection
/*
const ld = require('../../ldshared/index.js');
const db = ld.createMongooseConnection();
const leads = require('./leads.js');
const models = require('../../ldshared/models.js');
const Leads = models.Leads.getModel(db);
const quitDB = function() { setTimeout(function() { process.exit(0); }, 2000); };
leads.init(Leads);
*/

var companies = [];

/*
var getWebsiteIndex = function(header) {
    gettingHeader = false;
    var temp_list = Object.values(header);
    for (var i = 0; i < temp_list.length; i++) {
        if (temp_list[i] === 'Website' || temp_list[i] === 'Websites') {
            return i;
        }
    }
    return -1;
};
*/

function getWebsites() {
    csv()
    .fromFile(csvFilePath)
    .on('json', (jsonObj)=>{
        // combine csv header row and csv line to a json object
        // jsonObj.a ==> 1 or 4
        var url = jsonObj['Websites'] || jsonObj['Website']; // parsing the imported csv and getting objects
        var companysize = jsonObj['Number of Employees'] || jsonObj['Company Size'];
        var extrainfo = jsonObj['Extra'];
        var companylocation = jsonObj['Headquarters Location'] || jsonObj['Location'];
        var companyname = jsonObj['Company Name'] || jsonObj['Company'];

        var name = [];
        var website = [];
        var size = [];
        var extra = [];
        var location = [];
        var company = [];

        // console.log('Just printing out company size: ' + JSON.stringify(jsonObj, null, 2));

        if (url) { // if the url exists then you push things into different arrays so that it can be exported into a csv
            // name.push(companyname);
            // website.push(url);
            // size.push(companysize);
            // extra.push(extrainfo);
            // location.push(companylocation);
            company.push(companyname, url, companysize, extrainfo, companylocation);
            companies.push(company);
        }
        console.log('each company: ' + company);
    })
    .on('done', (error)=>{
        console.log('Companies: ' + companies);
        if (error) {
           console.log('Error occured converting from csv to json: ' + error);
        }
        start(companies);
    });
}
/*
var createLeadsDB = function(obj, callback) {
    console.log('AT CREATION');
    leads.create(obj.companyname, obj.website, obj.firstname, obj.lastname, obj.title, obj.email, obj.linkedin, obj.twitter, obj.facebook, obj.address, obj.size, obj.status, function(err, doc) {
        if (err) { return callback(err); }
        else {
            console.log('Yay!');
            callback();
            quitDB();
        }
    });
};
*/

function start(companies) {
    async.mapSeries(companies, clearbit.search, function(err, core) { //result is now core
        if (err) {
            console.log('Error: %j', err);
            return;
        }
        //console.log('checkpoint3: companies: ' + companies);
        console.log('\n\ncheckpoint3 + CORE Result: %s', JSON.stringify(core, null, 4));
        tocsv.go(core, function(error) {
            if (error) {
                console.log('Error occured converting from json back to csv: ' + error);
                return;
            }
            console.log('end');
            return;
        });
        /*
        async.each(core, createLeadsDB, function(err) {
            if (err) {
                console.log('Error in saving to MongoDB. Details: %j', err);
                return;
            }
            return callback(core);

        });*/
    });
}

function main() {
    getWebsites();
}

main();



