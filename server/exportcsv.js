var json2csv = require('json2csv');
var fs = require('fs');


exports.go = function(data, callback) { // exporting the parsed data into a csv
  console.log(JSON.stringify(data));
  var fields = Object.keys(data[0]);
  var fieldNames = ['Company Name', 'First Name', 'Last Name', 'Title', 'Email', 'Website', 'Verified', 'Reason', ' ', 'LinkedIn', 'Twitter', 'Facebook', 'Address', 'Company Size', 'Status'];

  var csv = json2csv({ data: data, fields: fields, fieldNames: fieldNames}); // format of the csv

  fs.writeFile('result.csv', csv, function(err) {
    if (err) {
        console.log('sup');
        return callback(err);
    }
    console.log('file saved');
    return callback();
  });
};
