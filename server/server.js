var express = require('express');
var cors = require('cors');

var app = express();
var oracle = require('./search.js');

app.use(cors());


app.post('/', function (req, res) {
  var domain = req.headers.domain;
  var personName = req.headers.name;
  var limit = req.headers.limit;
  var wrapper = [[], [domain], [], [], []];
  console.log('req.headers: ' + JSON.stringify(req.headers));
  oracle.search(wrapper, function(err, result) {
    if (err) {
        return;
    }
    console.log('result: %j', result);
    return res.send(result);
  });
});

app.listen(4000);
