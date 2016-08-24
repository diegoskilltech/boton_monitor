
/**
 * Module dependencies.
 */

var express = require('express');

//var MongoStore = require('connect-mongo')(express);
var config = require('./config/config');
var routes = require('./routes');

//Main rountes
var partials = require('./routes/partials')
//API routes

var http = require('http');
var path = require('path');

//Config loggin
var log4js = require('log4js');
var logger = log4js.getLogger('com.monitor');

logger.info('Monitor - app initialization...');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser('Monitor like a sir'));
// app.use(express.session({
//     secret: 'Monitor like a sir',
//     //cookie: {maxAge: 30 * 24 * 60 * 60 * 1000},
//     store: new MongoStore({
//       url: config.db.connection
//     })
//   }));

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//Error handler middleware
app.use(function(err, req, res, next){
	logger.error(err);
	res.send(500, 'Something broke!');
});

//Set the application locals
app.locals = {
  config: config
};

/**
 * Routing the application
 */
routes(app);


//connect(app);
partials(app);

/**
 * Routing REST API
 */

/**
 * Creates the server
 */
http.createServer(app).listen(app.get('port'), function(){
	logger.info('Monitor - express server listening on port ' + app.get('port') + ' --- ' + process.env.Monitor_STAGE);
});