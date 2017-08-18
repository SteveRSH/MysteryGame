const mustacheExpress = require('mustache-express');
const express = require('express');
const fs = require('fs');
const bodyparser = require('body-parser');
const server = express();
const session = require('express-session');

server.use(bodyparser.urlencoded({
  extended: false
}));
server.engine('mustache', mustacheExpress());
server.set('views', './views')
server.set('view engine', 'mustache')
server.get("/", function (req, res) {
  res.render('index');
  });




server.listen(3003, function () {
  console.log('Did you code today')
});
