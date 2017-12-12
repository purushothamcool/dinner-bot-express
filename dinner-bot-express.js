
var express  = require('express');
var app      = express(); 
var port  	 = process.env.PORT || 8091; 	

//var server = restify.createServer();

//server.listen(process.env.port || process.env.PORT || 3978, function(session)
//{
//console.log("%s listening at %s", server.name, server.url );
//});

app.listen(port);
console.log("App listening on port " + port);

require('./route.js')(app);
require('./dinner-bot.js')(app);
