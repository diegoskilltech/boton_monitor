require(['./view/dashboard.view', './alertas.main', './despachos.main'], function(DashboardView, AlertasMain, DespachosMain){
	
	//Routes definitions
	var routes = {
		"alertas":              "alerts",    
		"despachos":          	"forwarded",  
		"signout": 				"signout",
		"perfil": 				"profile",
		"*path": 				"dashboard"
	};

	var AppRouter = Backbone.Router.extend({
		routes: routes,

		alerts: function() {
			AlertasMain.render();
		},

		forwarded: function() {
			DespachosMain.render();
		},

		signout: function() {

		},

		profile: function() {

		},

		dashboard: function(page){
			new DashboardView().render();
		}
	});

	new AppRouter().bind('all', _.debounce(function(route, handler){
		var targets = _.invert(routes);
		if(handler){
			handler = (handler = targets[handler]) == '*path' ? '' : handler;
			console.log(handler);

			$('ul.nav li').removeClass('active');
			$(['ul.nav li a[href=#', handler, ']'].join('')).parent().addClass('active');
		} 
	}), 50);

	Backbone.history.start();
});