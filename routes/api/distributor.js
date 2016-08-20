var logger = require('log4js').getLogger('com.monitor');
var Security = require('../../middleware/security');
var distributorService = require('../../service/distributorService');

function Item(app){
	app.get('/api/distributor', list); //JSON
	app.post('/api/distributor', post); //JSON
	app.get('/api/distributor/:id', get); //JSON
	app.put('/api/distributor/:id', put); //JSON
	app.del('/api/distributor/:id', remove); //JSON
};

/**
 * GET user distributors.
 */
function list(req, res, next){
	logger.info('distributors route : list : getting distributor list');
	var user = req.session.user;

	distributorService.list(
			//On success	
			function(distributors){
				res.send(distributors);
			},
			
			//On error
			function(err){
				logger.error('distributors route : list : error trying to load distributor list', err);
				res.send(err);
			}
	);
};

/**
 * GET a distributor by OID String.
 */
function get(req, res, next){
	logger.info('distributors route : get : getting distributor get');
	var user = req.session.user;
	var distributorId = req.params.id;

	distributorService.get(
			distributorId,

			//On success	
			function(distributor){
				res.send(distributor);
			},
			
			//On error
			function(err){
				logger.error('distributors route : get : error trying to load distributor get', err);
				res.send(err);
			}
	);
};

/**
 * POST distributor.
 */
function post(req, res, next){
	logger.info('distributors route : post : saving distributor');
	var user = req.session.user;
	var plain = req.body;

	distributorService.insert(
			plain,

			//On success	
			function(docItem){
				res.send(docItem);
			},
			
			//On error
			function(err){
				logger.error('distributors route : post : error trying to save distributor', err);
				res.send(err);
			}
	);
};


/**
 * PUT distributor.
 */
function put(req, res, next){
	logger.info('distributors route : put : updating distributor');
	var user = req.session.user;
	var category = req.params.category;
	var id = req.params.id;
	var plain = req.body;

	distributorService.update(
			id,
			plain,

			//On success	
			function(docItem){
				res.send(docItem);
			},
			
			//On error
			function(err){
				logger.error('distributors route : put : error trying to update distributor', err);
				res.send(err);
			}
	);
};

/**
 * DELETE distributor.
 */
function remove(req, res, next){
	logger.info('distributors route : remove : deleting distributor');
	var distributorId = req.params.id;

	distributorService.delete(
			distributorId,
			
			//On success	
			function(distributors){
				res.send(distributors);
			},
			
			//On error
			function(err){
				logger.error('distributors route : remove : error trying to delete distributor', err);
				res.send(err);
			}
	);
};

module.exports = Item;