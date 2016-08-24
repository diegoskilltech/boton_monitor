define([], function(){
	//Projection mapper class
	var Projection = {
		init: _.once(function(){
			Proj4js.defs["EPSG:221951"] = "+proj=tmerc +lat_0=-34.6297166 +lon_0=-58.4627 +k=0.9999980000000001 +x_0=100000 +y_0=100000 +ellps=intl +towgs84=-148,136,90,0,0,0,0 +units=m +no_defs";		
		}),

		pointFromMercator: function(lon, lat){
			var dest = new Proj4js.Proj("EPSG:221951"),
				src = new Proj4js.Proj("EPSG:4326"),
				point = new Proj4js.Point(lon, lat);

			return Proj4js.transform(src, dest, point);
		}
	};

	var MapaAlerta = {
		init: _.debounce(function(marker){
			Projection.init();

			var miMapa = new usig.MapaInteractivo('map-location', {
				rootUrl: 'http://servicios.usig.buenosaires.gob.ar/usig-js/3.1/',
				zoomBar: false,

				onReady: function() {

					var point = Projection.pointFromMercator(marker.lon, marker.lat);
					//http://servicios.usig.buenosaires.gov.ar/symbols/mapabsas/bancos.png
					var iconUrl = '/img/alert.svg',
						iconSize = new OpenLayers.Size(41, 41),
						customMarker = new OpenLayers.Marker(
							new OpenLayers.LonLat(point.x, point.y),
							new OpenLayers.Icon(iconUrl, iconSize)
						);

						miMapa.addMarker(customMarker, true, function(e, o, t){
							console.log('e',e,'o',o, 't',t);
							return marker.desc;
						});

					//Camaras
					//https://200.16.89.79/SGAPM/images/camara.png
					var domos = [
						{lon: '101423.496581', lat: '101676.611766', desc: 'ZONA RESIDENCIAL(DOMO)'},
						{lon: '101928.51', lat: '101448.67', desc: 'LAVADERO DE AUTOS(DOMO)'},
						{lon: '101321.616664', lat: '101190.842682', desc: 'ESTADIO CLUB ATLETICO FERROCARRIL OESTE(DOMO)'},
						{lon: '101756.484725', lat: '101550.780488', desc: 'TALLER MECANICO, KIOSCO(DOMO)'},
						{lon: '101485.61', lat: '101402.04', desc: 'FLORES LA "SIEMPREVIVA"(DOMO)'}
					];

					_.each(domos, function(marker){
							var iconUrl = '/img/camera.svg',
								iconSize = new OpenLayers.Size(41,41),
								customMarker = new OpenLayers.Marker(
									new OpenLayers.LonLat(marker.lon, marker.lat),
									new OpenLayers.Icon(iconUrl, iconSize)
								);

								miMapa.addMarker(customMarker, false, marker.desc);
						});
				}//onReady
			});//Map constructor
		}, 500)//init
	};

	//Just return a new Backbone view class
 	/**
	 * Signin Form View
	 */
	return Backbone.View.extend({
		el: $('#despacho-form'),
		template: Handlebars.compile($('#despacho-form-template').html()),

		time: 3 * 60 * 1000,
		interval: null,

		events: {
			'click [data-action=submit]': 'onValidate'
		},

		//Do some render...
		render: function(item){
			var self = this;
			self.$el.modal();
			self.$el.find('.modal-body').empty().append(self.template(item));
			self.$el.on('keypress', function(){
				self.error.hide();
			});

			self.$el.validator({
				errors: {
					empty: 'El campo es obligatorio',
					match: 'No coincide',
					minlength: 'Debe ser más largo'
				}
			});

			self.$el.on('submit', _.bind(self.onSubmit, self));

			self.error = self.$el.find('.error');

			MapaAlerta.init({lat: -34.617381, lon: -58.442777});

			//MapaAlerta.init({lat: -34.617381, lon: -58.442777});

			self.interval = setInterval(function(){
				self.time -= 1000;
				self.$el.find('#block-timer').text(moment(self.time).format('mm:ss'));
				if(self.time < 2 * 60 * 1000 && self.time > 1 * 60 * 1000) self.$el.find('.shortcut').removeClass('bg-info-dk').addClass('bg-warning-dk');
				if(self.time < 1 * 60 * 1000) self.$el.find('.shortcut').removeClass('bg-warning-dk').addClass('bg-danger-dk');
			}, 1000);

			self.$el.on('hide.bs.modal', _.bind(window.clearInterval, window, self.interval));
		},

		//To validate the form
		onValidate: function(){
			console.log(this.$el.validator('validate'));
		},

		//do the info submit
		onSubmit: function(e){
			//Is valid?
			if (e.isDefaultPrevented()) return;
			e.preventDefault();

			var self = this;
			var form = self.$el;
			var user = _.reduce(form.find('input'), function(memo, field){
				field = $(field);
				memo[field.attr('name')] = unescape(field.val());
				return memo;
			}, {});
		}
	});
});