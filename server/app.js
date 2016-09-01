var express = require('express');
var bodyParser = require('body-parser');

var app = express();

require('./routes')(app);
require('./db');

app.listen(3000, function() {
  console.log('listening on port 3000');
});