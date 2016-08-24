
var logger = require('log4js').getLogger('com.monitor');
var config = require('../config/config');
var _ = require('underscore');

//Main Class
function Index(app){
	app.get('/', index);
	app.get('/dashboard', dashboard);
};

/*
 * GET home page.
 */
function index(req, res){
	res.render('landing/index');
};

/*
 * GET dashboard page.
 */
 function dashboard(req, res){
	res.render('dashboard/main');
};

module.exports = Index;