var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
  if (req.path === '/getdata') {
    res.json({ a: 1 });
  } else {
    res.redirect('/');
  }
});

module.exports = app;
