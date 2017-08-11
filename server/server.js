var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var csv = require('./importcsv');
var exportCsv = require('./exportcsv');

var app = express();
var oracle = require('./search.js');

app.use(cors());
app.use(bodyParser.json());

app.post('/csv', function (req, res) {
  var csvString = req.body.csvString;
  console.log(csvString);
  csv.getWebsites(csvString, function(results) {
    console.log('getWebsites passes to server');
    res.send(results);
  });
});

app.post('/export', function(req, res) {
  var jsonData = req.body.data;
  console.log(jsonData);
  exportCsv.go(jsonData, function(error) {
    if (error) {
      callback(error);
    }
    console.log('success');
    res.end();
  });
});

app.post('/', function (req, res) {
  var domain = req.headers.domain;
  var personName = req.headers.name;
  var limit = req.headers.limit;

  var payload = {}
  payload.url = domain;
  payload.specificPerson = personName;
  payload.limit = limit;

  console.log('req.headers: ' + JSON.stringify(req.headers));
  oracle.search(payload, function(err, result) {
    if (err) {
        return;
    }
    console.log('result in server: %j', result);
    return res.send(result);
  });
});

app.listen(4000);
