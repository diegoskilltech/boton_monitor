var logger = require('log4js').getLogger('com.monitor');
var Security = require('../../middleware/security');
var orderService = require('../../service/orderService');
var _ = require('underscore');

function Order(app){
	app.get('/api/order', list); //JSON
	app.get('/api/order/:id', get); //JSON
	app.post('/api/order', post); //JSON
	app.put('/api/order/:id', put); //JSON
	app.del('/api/order/:id', remove); //JSON
};

/**
 * GET user orders.
 */
function list(req, res, next){
	logger.info('orders route : list : getting order list');
	var user = req.session.user;

	orderService.list(
			user._id,

			//On success	
			function(orders){
				res.send(orders);
			},
			
			//On error
			function(err){
				logger.error('orders route : list : error trying to load order list', err);
				res.send(err);
			}
	);
};

/**
 * GET a order by OID String.
 */
function get(req, res, next){
	logger.info('orders route : get : getting order get');
	var user = req.session.user;
	var orderId = req.params.id;

	orderService.get(
			orderId,

			//On success	
			function(order){
				res.send(order);
			},
			
			//On error
			function(err){
				logger.error('orders route : get : error trying to load order get', err);
				res.send(err);
			}
	);
};

/**
 * POST order.
 */
function post(req, res, next){
	logger.info('orders route : post : saving order');
	var user = req.session.user;
	var plain = req.body;
	plain.user = _.pick(user, '_id', 'name', 'email');

	orderService.insert(
			user._id,
			plain,

			//On success	
			function(docOrder){
				res.send(docOrder);
			},
			
			//On error
			function(err){
				logger.error('orders route : post : error trying to save order', err);
				res.send(err);
			}
	);
};


/**
 * PUT order.
 */
function put(req, res, next){
	logger.info('orders route : put : updating order');
	var user = req.session.user;
	var orderId = req.params.id;
	var orderPlain = req.body;

	orderService.update(
			user._id,
			orderId,
			orderPlain,

			//On success	
			function(docOrder){
				res.send(docOrder);
			},
			
			//On error
			function(err){
				logger.error('orders route : put : error trying to update order', err);
				res.send(err);
			}
	);
};

/**
 * DELETE order.
 */
function remove(req, res, next){
	logger.info('orders route : remove : deleting order');
	var user = req.session.user;
	var orderId = req.params.id;

	orderService.delete(
			user._id,
			orderId,
			
			//On success	
			function(orders){
				res.send(orders);
			},
			
			//On error
			function(err){
				logger.error('orders route : remove : error trying to delete order', err);
				res.send(err);
			}
	);
};

module.exports = Order;