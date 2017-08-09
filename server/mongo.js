const leads = require('./leads.js');
const models = require('./models.js');
const ld = require('../../../ldshared/index.js');
const quit = function() { setTimeout(function() { process.exit(0); }, 2000); };
const async = require('async');
const _ = require('lodash');

var db = ld.createMongooseConnection();
var Leads = models.Leads.getModel(db);
leads.init(Leads);

var creation = function(obj, callback) {
    console.log('AT CREATION');
    leads.create(obj.company, obj.url, obj.firstname, obj.lastname, obj.title, obj.email, obj.location, obj.companySize, obj.linkedin, obj.twitter, obj.facebook, obj.status, function(err, doc){
        if(err){
            console.log('Error: %j', err);
            return callback(err);
        }
        else {
            console.log('Yay!');
            callback();
            quit();
        }
    });
}

exports.flatten = function(list, callback) { // ordering people and formatting the raw data, takes in the raw result
    console.log('about to flatten!');
    var listToAppend = [];
    // for (var i = 0; i < list.length; i++) {
    //     var peoplePerCompany = list[i].result.length;
    //     for (var j=0; j < peoplePerCompany; j++) {
    //         var beforeOrdered = _.merge(list[i].result[j], list[i].companyDetails);
    //         var afterOrdered = rearrange(beforeOrdered);
    //         listToAppend.push(afterOrdered);
    //     }
    // }
    for (var i = 0; i < list.result.length; i++) {
        var beforeOrdered = _.merge(list.result[i], list.companyDetails);
        var afterOrdered = rearrange(beforeOrdered);
        listToAppend.push(afterOrdered);
    }
    console.log('flattened!');
    console.log(listToAppend);
    orderAndMongo(listToAppend, function(err) {//this is core
        if(err){
            return callback(err);
        }
        return callback(null,listToAppend);
    });
};

function rearrange(before) {

    // Preserve the order
    var after = {};
    after.companyname = before.name;
    after.firstname = before.firstname;
    after.lastname = before.lastname;
    after.title = before.title;
    after.email = before.email;
    after.website = before.url;
    after.validmail = before.validemail;
    after.reason = 'Fill in';
    after.extraspace = '            ';
    after.linkedin = '';
    after.twitter = '';
    after.facebook = '';

    if (before.linkedin) {after.linkedin = 'https://' + before.linkedin; }
    if (before.twitter) {after.twitter = 'https://' + before.twitter;}
    if (before.facebook) {after.facebook = 'https://' + before.facebook;}

    after.address = before.address;
    after.size = before.size;
    after.status = "searched";
    return after;
}

var orderAndMongo = function(core,callback) {
    console.log('about to order mongo');
    var dataArr = [];
    //console.log(result[0]);
    for (var i = 0; i < core.length; i++) {
        var createdObj = {};
        createdObj.company = core[i].companyname;
        createdObj.url = core[i].website;
        createdObj.firstname = core[i].firstname;
        createdObj.lastname = core[i].lastname;
        createdObj.title = core[i].title;
        createdObj.email = core[i].email;
        createdObj.location = core[i].address;
        createdObj.companySize = core[i].size;
        createdObj.linkedin = core[i].linkedin;
        createdObj.twitter = core[i].twitter;
        createdObj.facebook = core[i].facebook;
        createdObj.status = core[i].status;
        dataArr.push(createdObj);
    }
    async.eachSeries(dataArr, creation, function(err){
	    if (err) {
	        return callback(err);
	    }
	    return callback();
	});
}
