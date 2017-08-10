var json2csv = require('json2csv');
var fs = require('fs');


exports.go = function(data, callback) { // exporting the parsed data into a csv
  var fields = ['Company Name', 'First Name', 'Last Name', 'Title', 'Email', 'Website', 'Verified', 'Reason', ' ', 'LinkedIn', 'Twitter', 'Facebook', 'Address', 'Company Size', 'Status'];
  var newData = [];
  var next;
  //console.log('Final Data: %j', data);
  for (var i = 0; i < data.length; i++) {
    next = data[i];
    for (var j = 0; j < next.length; j++) {
            newData.push({
                'Company Name': next[j].company
                , 'First Name': next[j].firstname
                , 'Last Name': next[j].lastname
                , 'Title': next[j].title
                , 'Email': next[j].email
                , 'Website': next[j].url
                , 'Verified': next[j].verified
                , 'Reason': 'Fill In'
                , ' ': ' '
                , 'LinkedIn': next[j].linkedin
                , 'Twitter': next[j].twitter
                , 'Facebook': next[j].facebook
                , 'Address': next[j].location
                , 'Company Size': next[j].companySize
                , 'Status': next[j].status
            });
    }
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
};
