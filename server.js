var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var csv = require('./importcsv');
var exportCsv = require('./exportcsv');
var leads = require('./leads');
var fs = require('fs');
const http = require('http');
const https = require('https');
const secret = require('../absecret');

function proxyToSecure(req, res) {
  res.writeHead(301, {
    'Location': 'https://' + req.headers.host + req.url
  });
  res.end();
}

var app = express();
var oracle = require('./search.js');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client/build'));

app.get('/download', function(req, res) {
  console.log('Download path working');
  var file = __dirname + '/result.csv';
  res.download(file);
})

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/client/build/index.html');
})

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
  exportCsv.go(jsonData, function(csv) {
    fs.writeFile('result.csv', csv, function(err) {
      if (err) {
          console.log(err);
          res.send(err);
      }
      console.log('file saved');
      var file = __dirname + '/result.csv';
      res.download(file);
    });
  });
});

app.post('/lead', function(req, res) {
  var object = req.body.data;
  console.log(object);
  leads.create(object.company, object.url, object.keyURL, object.reason, object.firstname, object.lastname, object.title, 
    object.email, object.linkined, object.twitter, object.facebook, object.location, object.companySize, object.status, function() {
    console.log('Item updated');
    res.end();
  });
})

app.post('/', function (req, res) {
    console.log('req: ' + req.body.data);
  var domain = req.body.data.domain;
  var personName = req.body.data.name;
  var limit = req.body.data.limit;

  var payload = {};
  payload.url = domain;
  payload.specificPerson = personName;
  payload.limit = limit;

  console.log('req.headers: ' + JSON.stringify(req.headers));
  oracle.search(payload, function(err, result) {
    if (err) {
        return;
    }
    var object = {};
    if (result.length) {
      var companyName = result[0].keyurl || result[0].keyURL;
      object[companyName] = result;
      console.log('result in server: %j', object);
      return res.send(result);
    }
    res.end();
  });
});

var httpsServer = https.createServer(secret.ldcredentials, app).listen(443, function() {
  console.log('https server running on port 443');
})

var server = http.createServer(proxyToSecure).listen(80, function() {
  console.log('http server running on port 80');
});
