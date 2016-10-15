
var express = require('express');
var app = express();
var port = 8081;
app.use(express.static('static'));

app.use(express.static(__dirname + '/views'));


var bodyParser = require('body-parser')
    app.use( bodyParser.json() );       // to support JSON-encoded bodies
    app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
        extended: true
    })); 
    
require('./config.js')(app)
require('./router.js')(app)

app.listen(port);
console.log('Server started! At http://localhost:' + port);