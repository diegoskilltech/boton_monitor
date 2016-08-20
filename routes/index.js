
var logger = require('log4js').getLogger('com.monitor');
var config = require('../config/config');
var _ = require('underscore');

/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('landing/index');
};