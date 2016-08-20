var logger = require('log4js').getLogger('com.calcubox');
var config = require('../../config/config');
var Security = require('../../middleware/security');
var country = require('../../service/model/static/country.json');
var material = require('../../service/model/static/material.json');
var producto = require('../../service/model/static/producto.json');
var formula = require('../../service/model/static/formula.json');

function Master(app){
	app.get('/api/country', Security.noCache, listCountry); //JSON
	app.get('/api/material', Security.noCache, listMaterial); //JSON
	app.get('/api/producto', Security.noCache, listProducto); //JSON
	app.get('/api/formula', Security.noCache, listFormula); //JSON
};

/**
 * GET user topics.
 */
function listCountry(req, res, next){
	logger.info('master route : list : country');
	res.send(country);
};

/**
 * GET user topics.
 */
function listMaterial(req, res, next){
	logger.info('master route : list : material');
	res.send(material);
};

/**
 * GET productos
 */
function listProducto(req, res, next){
	logger.info('master route : list : producto');
	res.send(producto);
};

/**
 * GET Formulas
 */
function listFormula(req, res, next){
	logger.info('master route : list : formula');
	res.send(formula);
};

/**
 * GET a topic by OID String.
 */
function get(req, res, next){
	logger.info('master route : get : getting company topic get');
	var user = req.session.user;
	var projectId = user.projectId;

	var topicId = req.params._id;

	topicService.getTopic(
			projectId,
			topicId,

			//On success	
			function(topic){
				res.send(topic);
			},
			
			//On error
			function(err){
				logger.error('master route : get : error trying to load company topic get', err);
				res.send(err);
			}
	);
};

/**
 * POST company topic.
 */
function post(req, res, next){
	logger.info('master route : post : saving company topic');
	var user = req.session.user;
	var projectId = user.projectId;

	var topicPlain = req.body;

	topicService.insertTopic(
			projectId,
			topicPlain,

			//On success	
			function(docTopic){
				res.send(docTopic);
			},
			
			//On error
			function(err){
				logger.error('master route : post : error trying to save company topic', err);
				res.send(err);
			}
	);
};


/**
 * PUT company topic.
 */
function put(req, res, next){
	logger.info('master route : put : updating company topic');
	var user = req.session.user;
	var projectId = user.projectId;

	var topicPlain = req.body;
	topicPlain._id = req.params._id;

	topicService.updateTopic(
			projectId,
			topicPlain,

			//On success	
			function(docTopic){
				res.send(docTopic);
			},
			
			//On error
			function(err){
				logger.error('master route : put : error trying to update company topic', err);
				res.send(err);
			}
	);
};

/**
 * DELETE company topic.
 */
function remove(req, res, next){
	logger.info('master route : remove : deleting company topic');
	var user = req.session.user;
	var projectId = user.projectId;

	var topicId = req.params._id;

	topicService.deleteTopic(
			projectId,
			topicId,
			
			//On success	
			function(topics){
				res.send(topics);
			},
			
			//On error
			function(err){
				logger.error('master route : remove : error trying to delete company topic', err);
				res.send(err);
			}
	);
};

module.exports = Master;