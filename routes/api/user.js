var logger = require('log4js').getLogger('com.monitor');
var userService = require('../../service/userService');
var mailerService = require('../../service/mailerService');
var _ = require('underscore');
var Security = require('../../middleware/security');

function User(app){
	app.get('/api/me', Security.restrict, Security.noCache, getUser); //JSON
	app.put('/api/me', Security.restrict, Security.noCache, putUser); //JSON
	app.put('/api/me/password', Security.restrict, Security.noCache, putPassword); //JSON
	app.post('/api/me/password/request', passwordRequest); //JSON
	app.del('/api/me', Security.restrict, Security.noCache, removeUser); //JSON
	app.put('/api/me/tutorial', Security.restrict, Security.noCache, putTutorial); //JSON
	app.post('/api/me/project/:id', setProject); //JSON

	app.get('/api/user', Security.restrict, Security.noCache, list); //JSON
	app.post('/api/user', Security.restrict, Security.noCache, post); //JSON
	app.put('/api/user/:id', Security.restrict, Security.noCache, put); //JSON
	app.del('/api/user/:id', Security.restrict, Security.noCache, remove); //JSON
};

/**
 * Put user changes.
 */
function putUser(req, res){
	logger.info('user : putUser : puttin user changes ');
	var user = req.session.user;
	var plainUser = req.body;

	userService.update(
			user,
			plainUser,
			//On success	
			function(user){
				res.send(user);
			},
			
			//On error
			function(err){
				logger.error('user : putUser : error trying to put user ' + plainUser, err);
				res.send(err);
			}		
	);
};

/**
 * Put user password.
 */
function putPassword(req, res){
	logger.info('user : putPassword : puttin user password ');
	var user = req.session.user;
	var password = req.body;

	userService.password(
			user,
			password,
			//On success	
			function(hashed){
				user.hashedPassword = hashed;
				res.send(user);
			},
			
			//On error
			function(err){
				logger.error('user : putPassword : error trying to put user password', err);
				res.send(err);
			}		
	);
};

/**
 * Get user.
 */
function getUser(req, res){
	logger.info('user : getUser : fetching user');

	var leMeId = req.session.user._id;
	userService.getUserById(
		leMeId,

		//On success	
		function(docUser){
			if(docUser){
				var user = _.omit(docUser, ['accessToken', 'hashedPassword']);
				user.isConnectedFB = docUser.accessToken && true;
				user.hasPassword = docUser.hashedPassword && true;
				res.send(user);
			}else{
				res.send({});
			}
		},
		
		//On error
		function(err){
			logger.error('user : getUser : error trying to get user [%S]', _id, err);
			res.send(err);
		}

	);

};

/**
 * Password request.
 */
function passwordRequest(req, res){
	var email = req.body.email;
	
	logger.info('user : passwordRequest : about to generate forgot password request for user [%s]', email);
	
	//Login the user
	userService.passwordRequest(
		email,
		//On success	
		function(user){
			res.send({code: 200});
		},
		
		//On error
		function(err){
			logger.error('user : passwordRequest : error trying to get user ' + email, err);
			res.send(err);
		}
	);
};

/**
 * Delete user request.
 */
function removeUser(req, res){
	var user = req.session.user;
	
	logger.info('user : removeUser : about to delete user account for [%s]', user._id);
	
	//Login the user
	userService.removeUser(
		user,
		//On success	
		function(user){
			req.session.destroy();
			res.send({code: 200});
		},
		
		//On error
		function(err){
			logger.error('user : removeUser : error trying to delete user [%s]', user._id, err);
			res.send(err);
		}
	);
};

/**
 * Put user tutorial.
 */
function putTutorial(req, res){
	logger.info('user : putTutorial : puttin user tutorial');
	var tutorialState = req.body;
	var user = req.session.user;

	logger.info('user : putTutorial : puttin user tutorial [%s]', JSON.stringify(tutorialState));
	userService.updateTutorial(
			user,
			tutorialState.name,
			tutorialState.state,

			//On success	
			function(tutorial){
				logger.info('user : putTutorial : saved tutorial [%s]', JSON.stringify(tutorial));

				if(tutorialState.name == 'done'){
					user.tutorial = user.tutorial || {};
					user.tutorial[tutorialState.name] = tutorialState.state;
				}

				res.send({code: 200});
			},
			
			//On error
			function(err){
				logger.error('user : putTutorial : error trying to put user tutorial', err);
				res.send(err);
			}		
	);
};

/**
 * Delete user request.
 */
function setProject(req, res){
	var user = req.session.user;
	logger.info('user : setProject : about to delete user account for [%s]', user._id);
	user.projectId = req.params.id;

	res.send({code: 200});
};

/**
 * Put user changes.
 */
function list(req, res){
	logger.info('user : list : listing users ... ');
	var user = req.session.user;

	userService.list(

			//On success	
			function(users){
				res.send(users);
			},
			
			//On error
			function(err){
				logger.error('user : list : error trying to list users ', err);
				res.send(err);
			}		
	);
};

/**
 * Put user changes.
 */
function put(req, res){
	logger.info('user : put : puttin user changes ');
	var user = req.session.user;
	var userId = req.params.id;
	var plainUser = req.body;

	userService.update(
			userId,
			plainUser,
			//On success	
			function(user){
				res.send(user);
			},
			
			//On error
			function(err){
				logger.error('user : remove : error trying to put user ' + plainUser, err);
				res.send(err);
			}		
	);
};

/**
 * Put user changes.
 */
function post(req, res){
	logger.info('user : post : puttin user changes ');
	var plainUser = req.body;

	userService.insert(
			plainUser,
			//On success	
			function(user){
				res.send(user);
			},
			
			//On error
			function(err){
				logger.error('user : post : error trying to put user ' + plainUser, err);
				res.send(err);
			}		
	);
};

/**
 * Put user changes.
 */
function remove(req, res){
	logger.info('user : remove : user changes ');
	var user = req.session.user;
	var userId = req.params.id;
	var plainUser = req.body;

	userService.update(
			userId,
			plainUser,
			//On success	
			function(user){
				res.send(user);
			},
			
			//On error
			function(err){
				logger.error('user : remove : error trying to put user ' + plainUser, err);
				res.send(err);
			}		
	);
};
module.exports = User;