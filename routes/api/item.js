var logger = require('log4js').getLogger('com.monitor');
var Security = require('../../middleware/security');
var itemService = require('../../service/itemService');

function Item(app){
	app.get('/api/item/:category', list); //JSON
	app.get('/api/item/:category/:id', get); //JSON
	app.post('/api/item/:category', post); //JSON
	app.put('/api/item/:category/:id', put); //JSON
	app.del('/api/item/:category/:id', remove); //JSON
};

/**
 * GET user items.
 */
function list(req, res, next){
	logger.info('items route : list : getting item list');
	var category = req.params.category;
	var user = req.session.user;

	itemService.list(
			category,

			//On success	
			function(items){
				res.send(items);
			},
			
			//On error
			function(err){
				logger.error('items route : list : error trying to load item list', err);
				res.send(err);
			}
	);
};

/**
 * GET a item by OID String.
 */
function get(req, res, next){
	logger.info('items route : get : getting item get');
	var user = req.session.user;
	var category = req.params.category;
	var itemId = req.params.id;

	itemService.get(
			itemId,

			//On success	
			function(item){
				res.send(item);
			},
			
			//On error
			function(err){
				logger.error('items route : get : error trying to load item get', err);
				res.send(err);
			}
	);
};

/**
 * POST item.
 */
function post(req, res, next){
	logger.info('items route : post : saving item');
	var user = req.session.user;
	var category = req.params.category;
	var plain = req.body;

	itemService.insert(
			category,
			plain,

			//On success	
			function(docItem){
				res.send(docItem);
			},
			
			//On error
			function(err){
				logger.error('items route : post : error trying to save item', err);
				res.send(err);
			}
	);
};


/**
 * PUT item.
 */
function put(req, res, next){
	logger.info('items route : put : updating item');
	var user = req.session.user;
	var category = req.params.category;
	var id = req.params.id;
	var plain = req.body;

	itemService.update(
			id,
			plain,

			//On success	
			function(docItem){
				res.send(docItem);
			},
			
			//On error
			function(err){
				logger.error('items route : put : error trying to update item', err);
				res.send(err);
			}
	);
};

/**
 * DELETE item.
 */
function remove(req, res, next){
	logger.info('items route : remove : deleting item');
	var itemId = req.params.id;

	itemService.delete(
			itemId,
			
			//On success	
			function(items){
				res.send(items);
			},
			
			//On error
			function(err){
				logger.error('items route : remove : error trying to delete item', err);
				res.send(err);
			}
	);
};

module.exports = Item;