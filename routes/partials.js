function Partials(app){
	app.get('/partials/:id', get)
};

/*
 * GET partial page.
 */
function get(req, res){
	var id = req.params.id;
	res.render(['partials/templates', id].join('/'));
};

module.exports = Partials;