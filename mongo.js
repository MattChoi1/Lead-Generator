const leads = require('./leads.js');
const models = require('./models.js');
const ld = require('./mongoose.js');
const async = require('async');
const _ = require('lodash');

var db = ld.createMongooseConnection();
var Leads = models.Leads.getModel(db);
leads.init(Leads);
// creates a mongo object
exports.create = function(original, callback) { // takes in raw clearbit data, in the form of an array of json objects
    //console.log('AT CREATION');
    //console.log('ORIGINAL: %j', original);
    var newData = [];
    if (original) {
        var website = original.companyDetails.url;
        var nodotcom;
        var withdotcom;
        var wwwLocation = website.indexOf('www');
        var colonLocation = website.indexOf(':');
        var periodLocation;
        //https + www format
        if (wwwLocation !== -1 && wwwLocation === colonLocation + 3) {
          //takes the location of the period before the com, net, etc
          periodLocation = website.indexOf('.',wwwLocation + 4);
          nodotcom = website.substring(wwwLocation + 4, periodLocation);
          //if there is / at the end of the url
          if(website.indexOf('/', colonLocation + 3) !== -1) {
            withdotcom = website.substring(wwwLocation + 4, website.indexOf('/', colonLocation + 3));
          }
          //no / at the end of the url
          else {
            withdotcom = website.substring(wwwLocation + 4, website.length);
          }
        }
        //https and no www
        else if (colonLocation != -1) {
          periodLocation = website.indexOf('.', colonLocation);
          nodotcom = website.substring(colonLocation + 3, periodLocation);
          if(website.indexOf('/', colonLocation + 3) !== -1) {
            withdotcom = website.substring(colonLocation + 3, website.indexOf('/', colonLocation + 3));
          }
          else {
            withdotcom = website.substring(colonLocation + 3, website.length);
          }
        }
        //no https, no www
        else {
          withdotcom = website;
          nodotcom = website.substring(0,website.indexOf('.'));
        }
        //checking for .co, changes to .com
        // if (withdotcom.substring(withdotcom.length - 2, withdotcom.length) === 'co') {
        //   withdotcom = withdotcom + "m";
        // }
        for (var j = 0; j < original.result.length; j++) { // push the raw data into a format that we can use to put into mongo
            newData.push({
                'company': original.companyDetails.company
                , 'firstname': original.result[j].firstname
                , 'lastname': original.result[j].lastname
                , 'title': original.result[j].title
                , 'email': original.result[j].email
                , 'url': original.companyDetails.url
                , 'keyurl': withdotcom
                , 'reason': null
                , 'verified': original.result[j].validemail
                , 'linkedin': original.result[j].linkedin
                , 'twitter': original.result[j].twitter
                , 'facebook': original.result[j].facebook
                , 'address': original.companyDetails.address
                , 'size': original.companyDetails.size
                , 'status': 'New!'
            });
        }
    }
    // console.log('NEW DATA: %j',newData);
    // create a mongo object
    async.each(newData, function(item, cb) {
        //console.log('item ' + JSON.stringify(item, null, 2));
        leads.create(item.company, item.url, item.keyurl, item.reason, item.firstname, item.lastname, item.title, item.email, item.linkedin, item.twitter, item.facebook, item.address, item.size, item.status, function(err, doc) {
            if (err) {
                console.log('Error in saving to mongo: %j', err);
                cb(err);
            } else {
                cb();
            }
        });
    }, function(err) { // callback, if there's an error, return the error, if not, return the formatted data to use for the table display and export csv
        if (err) {
            console.log('Error: %j', err);
            return callback(err);
        } else {
            //console.log('Yay!');
            return callback(null, newData);
        }
    });
};
// function that runs first to check if things are in mongo or not
exports.getAndUpdate = function(URL, callback) { // takes in the url
  //console.log('at getandupdate');
  // parsing the url to get the domain with and without the dot com
  var website = URL;
  if (website) {
    var wwwLocation = website.indexOf('www');
    var colonLocation = website.indexOf(':');
    var periodLocation;
    //https + www format
    if (wwwLocation !== -1 && wwwLocation === colonLocation + 3) {
      //takes the location of the period before the com, net, etc
      periodLocation = website.indexOf('.',wwwLocation + 4);
      nodotcom = website.substring(wwwLocation + 4, periodLocation);
      //if there is / at the end of the url
      if(website.indexOf('/', colonLocation + 3) !== -1) {
        withdotcom = website.substring(wwwLocation + 4, website.indexOf('/', colonLocation + 3));
      }
      //no / at the end of the url
      else {
        withdotcom = website.substring(wwwLocation + 4, website.length);
      }
    }
    //https and no www
    else if (colonLocation != -1) {
      periodLocation = website.indexOf('.', colonLocation);
      nodotcom = website.substring(colonLocation + 3, periodLocation);
      if(website.indexOf('/', colonLocation + 3) !== -1) {
        withdotcom = website.substring(colonLocation + 3, website.indexOf('/', colonLocation + 3));
      }
      else {
        withdotcom = website.substring(colonLocation + 3, website.length);
      }
    }
    //no https, no www
    else {
      withdotcom = website;
      nodotcom = website.substring(0,website.indexOf('.'));
    }
    //checking for .co, changes to .com
    if (withdotcom.substring(withdotcom.length - 2, withdotcom.length) === 'co') {
      withdotcom = withdotcom + "m";
    }
  }

  //console.log('checking if things are in mongo!');
  // first try the domain with the dot com, then without the dot com
  leads.get({keyURL: withdotcom}, function(err, doc){
    if (err) {
      //console.log('trying again');
      leads.get({keyURL: nodotcom}, function(err, doc){
        if (err) {
          console.log('Cant find anything'); // second search doesn't return anything, then return the error
          return callback(err);
        }
        else {
          flatten(doc, nodotcom, function(err, result){ // flattens the mongo results so that we can update mongo
            if (err) {
              return callback(err);
            }
            else {
              return callback(null,result); //returns the new result
            }
          });
        }
      });
    }
    else {
      // console.log(doc);
      flatten(doc, withdotcom, function(err, result){
        if (err) {
          return callback(err);
        }
        else {
          return callback(null, result);
        }
      });
    }
  });
}

var flatten = function(arr, url, callback) {
  // var compname = (Object.keys(obj))[0];
  // var leadsArr = obj.compname;
  // console.log(leadsArr);
  var peopleArr = [];
  for (var i = 0; i < arr.length; i++) {
    if(arr[i].status === "New!" || arr[i].status === "New to Mongo!") { // to see if the mongo results contains leads that have new
      var leadsObj = {};
      leadsObj.email = arr[i].email;
      peopleArr.push(leadsObj);
    }
  }
  if (peopleArr.length === 0) {
    return callback(null, arr); // returns the original array because no changes are made
  }
  else {
    async.each(peopleArr, function(item, cb) {
        //console.log('item ' + JSON.stringify(item, null, 2));
        leads.update({email: item.email}, { $set: {status: "In Oracle"}}, function(err, doc) { // update the status of said mongo object to in oracle
            if (err) {
                console.log('Error in updating mongo: %j', err);
                cb(err);
            } else {
                cb();
            }
        });
    }, function(err) {
        if (err) {
          console.log('Error: %j', err);
          return callback(err);
        } else {
          leads.get({keyURL: url}, function(err, doc){ // do a search for get the leads with the new status
            return callback(null, doc);
          });
        }
    });
  }
}

// exports.flatten = function(list, callback) { // ordering people and formatting the raw data, takes in the raw result
//     console.log('about to flatten!');
//     var listToAppend = [];
//     // for (var i = 0; i < list.length; i++) {
//     //     var peoplePerCompany = list[i].result.length;
//     //     for (var j=0; j < peoplePerCompany; j++) {
//     //         var beforeOrdered = _.merge(list[i].result[j], list[i].companyDetails);
//     //         var afterOrdered = rearrange(beforeOrdered);
//     //         listToAppend.push(afterOrdered);
//     //     }
//     // }
//     for (var i = 0; i < list.result.length; i++) {
//         var beforeOrdered = _.merge(list.result[i], list.companyDetails);
//         var afterOrdered = rearrange(beforeOrdered);
//         listToAppend.push(afterOrdered);
//     }
//     console.log('flattened!');
//     console.log(listToAppend);
//     orderAndMongo(listToAppend, function(err) {//this is core
//         if(err){
//             return callback(err);
//         }
//         return callback(null,listToAppend);
//     });
// };

// function rearrange(before) {

//     // Preserve the order
//     var after = {};
//     after.companyname = before.name;
//     after.firstname = before.firstname;
//     after.lastname = before.lastname;
//     after.title = before.title;
//     after.email = before.email;
//     after.website = before.url;
//     after.validmail = before.validemail;
//     after.reason = 'Fill in';
//     after.extraspace = '            ';
//     after.linkedin = '';
//     after.twitter = '';
//     after.facebook = '';

//     if (before.linkedin) {after.linkedin = 'https://' + before.linkedin; }
//     if (before.twitter) {after.twitter = 'https://' + before.twitter;}
//     if (before.facebook) {after.facebook = 'https://' + before.facebook;}

//     after.address = before.address;
//     after.size = before.size;
//     after.status = "searched";
//     return after;
// }

// var orderAndMongo = function(core,callback) {
//     console.log('about to order mongo');
//     var dataArr = [];
//     //console.log(result[0]);
//     for (var i = 0; i < core.length; i++) {
//         var createdObj = {};
//         createdObj.company = core[i].companyname;
//         createdObj.url = core[i].website;
//         createdObj.firstname = core[i].firstname;
//         createdObj.lastname = core[i].lastname;
//         createdObj.title = core[i].title;
//         createdObj.email = core[i].email;
//         createdObj.location = core[i].address;
//         createdObj.companySize = core[i].size;
//         createdObj.linkedin = core[i].linkedin;
//         createdObj.twitter = core[i].twitter;
//         createdObj.facebook = core[i].facebook;
//         createdObj.status = core[i].status;
//         dataArr.push(createdObj);
//     }
//     async.eachSeries(dataArr, creation, function(err){
// 	    if (err) {
// 	        return callback(err);
// 	    }
// 	    return callback();
// 	});
// }
