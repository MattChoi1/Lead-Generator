var json2csv = require('json2csv');

exports.go = function(data, callback) { // exporting the parsed data into a csv
  var fields = ['Company Name', 'First Name', 'Last Name', 'Title', 'Email', 'Website', 'Verified', 'Reason', ' ', 'LinkedIn', 'Twitter', 'Facebook', 'Address', 'Company Size', 'Status'];
  var newData = [];
  var next;
  //console.log('Final Data: %j', data);
  for (var j = 0; j < data.length; j++) {
    var company = data[j];
    for (var i = 0; i < company.length; i++) {  
      next = company[i];
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
  }

  var csv = json2csv({ data: newData, fields: fields}); // format of the csv

  callback(csv);
};
