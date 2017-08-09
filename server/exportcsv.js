var json2csv = require('json2csv');
var fs = require('fs');


exports.go = function(data, callback) { // exporting the parsed data into a csv
  console.log(JSON.stringify(data, null, 2));
  var fields = ['Company Name', 'First Name', 'Last Name', 'Title', 'Email', 'Website', 'Verified', 'Reason', ' ', 'LinkedIn', 'Twitter', 'Facebook', 'Address', 'Company Size', 'Status'];
  var newData = [];
  var next;
  for (var i = 0; i < data.length; i++) {
    next = data[i];
    for (var j = 0; j < next.result.length; j++) {
            newData.push({
                'Company Name': next.companyDetails.name
                , 'First Name': next.result[j].firstname
                , 'Last Name': next.result[j].lastname
                , 'Title': next.result[j].title
                , 'Email': next.result[j].email
                , 'Website': next.companyDetails.url
                , 'Verified': next.result[j].validemail
                , 'Reason': 'Fill In'
                , ' ': ' '
                , 'LinkedIn': next.result[j].linkedin
                , 'Twitter': next.result[j].twitter
                , 'Facebook': next.result[j].facebook
                , 'Address': next.companyDetails.address
                , 'Company Size': next.companyDetails.size
                , 'Status': 'searched'
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
