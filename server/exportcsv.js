var json2csv = require('json2csv');
var fs = require('fs');


exports.go = function(data, callback) { // exporting the parsed data into a csv
  var fields = ['Company Name', 'First Name', 'Last Name', 'Title', 'Email', 'Website', 'Verified', 'Reason', ' ', 'LinkedIn', 'Twitter', 'Facebook', 'Address', 'Company Size', 'Status'];
  var newData = [];
  var next;
  //console.log('Final Data: %j', data);
  for (var i = 0; i < data.length; i++) {
    next = data[i];
    console.log(next);
    // next = data[i];
    // for (var j = 0; j < next.length; j++) {
        newData.push({
            'Company Name': next.company || next.companyname
            , 'First Name': next.firstname
            , 'Last Name': next.lastname
            , 'Title': next.title
            , 'Email': next.email
            , 'Website': next.url || next.website
            , 'Verified': next.verified
            , 'Reason': 'Fill In'
            , ' ': ' '
            , 'LinkedIn': next.linkedin
            , 'Twitter': next.twitter
            , 'Facebook': next.facebook
            , 'Address': next.location
            , 'Company Size': next.companySize
            , 'Status': next.status
        });
  }

  var csv = json2csv({ data: newData, fields: fields}); // format of the csv

  fs.writeFile('result.csv', csv, function(err) {
    if (err) {
        console.log('sup');
        return callback(err);
    }
    console.log('file saved');
    return callback();
  });
}