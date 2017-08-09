var json2csv = require('json2csv');
var fs = require('fs');


exports.go = function(data, callback) { // exporting the parsed data into a csv
  console.log(JSON.stringify(data, null, 2));
  var fields = [];

  var next;
  var result;
  for (var i = 0; i < data.length; i++) {
    next = data[i];
    for (var j = 0; j < next.result.length; j++) {
            fields.push({
                label: 'Company Name'
                , value: next.companyDetails.name
            }
            , {
                label: 'First Name'
                , value: next.result[j].firstname
            }
            , {
                label: 'Last Name'
                , value: next.result[j].lastname
            }
            , {
                label: 'Title'
                , value: next.result[j].title
            }
            , {
                label: 'Email'
                , value: next.result[j].email
            }
            , {
                label: 'Website'
                , value: next.companyDetails.url
            }
            , {
                label: 'Verified'
                , value: next.result[j].validemail
            }
            , {
                label: 'Reason'
                , value: null
            }
            , {
                label: ' '
                , value: ' '
            }
            , {
                label: 'LinkedIn'
                , value: next.result[j].linkedin
            }
            , {
                label: 'Twitter'
                , value: next.result[j].twitter
            }, {
                label: 'Facebook'
                , value: next.result[j].facebook
            }
            , {
                label: 'Address'
                , value: next.companyDetails.address
            }
            , {
                label: 'Company Size'
                , value: next.companyDetails.size
            }
            , {
                label: 'Status'
                , value: 'searched'
            });
    }
  }

  var csv = json2csv({ data: data, fields: fields}); // format of the csv

  fs.writeFile('result.csv', csv, function(err) {
    if (err) {
        console.log('sup');
        return callback(err);
    }
    console.log('file saved');
    return callback();
  });
};
