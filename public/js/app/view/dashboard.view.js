define([], function(){
	//REFERENCE
	//Cámaras
	//https://200.16.89.79/SGAPM/frmConsultaCamarasMapa.php?pagina=frmConsultaCamaras2&direccion=Ortega%20980&dirx=101670.685272&diry=101580.710751&distancia=370

	//Mapa
	//http://servicios.usig.buenosaires.gov.ar/usig-js/3.1/doc/

	//Sound
	//https://web.whatsapp.com/assets/notification.mp3

	//BAstrap
	//http://gcba.github.io/BAstrap/comenzar.html

	//Projection mapper class
	var Projection = {
		init: function(){
			Proj4js.defs["EPSG:221951"] = "+proj=tmerc +lat_0=-34.6297166 +lon_0=-58.4627 +k=0.9999980000000001 +x_0=100000 +y_0=100000 +ellps=intl +towgs84=-148,136,90,0,0,0,0 +units=m +no_defs";		
		},

		pointFromMercator: function(lon, lat){
			var dest = new Proj4js.Proj("EPSG:221951"),
				src = new Proj4js.Proj("EPSG:4326"),
				point = new Proj4js.Point(lon, lat);

			return Proj4js.transform(src, dest, point);
		}
	};


	//MAP
	var MapDash = {
		init: function(){
			//var aspect = 500 / 600;
			var map = $('#mapa');
			map.css('height', 500);
			
			var pt =  {lon: "101806.3749416742648464", x: "101806.3749416742648464", lat: "101380.6150423938233871", y: "101380.6150423938233871"};

			var miMapa = new usig.MapaInteractivo('mapa', {
				rootUrl: 'http://servicios.usig.buenosaires.gob.ar/usig-js/3.1/',
				zoomBar: false,
				//- baseLayer: 'mapabsas_default_3857',
				//- bounds: [-6586111.0983854, -4163569.2579354, -6423147.3540814, -4060073.5216372],
				//- initBounds: [-6517826.22446, -4125200.57343, -6491737.97612, -4098977.26534],

				//- OpenLayersOptions: {
				//- 	controls: [],
				//- 	resolutions: [152.8740565703525, 76.43702828517624, 38.21851414258813, 19.10925707129406, 9.554628535647032, 4.777314267823516, 2.388657133911758, 1.194328566955879, 0.5971642834779395], 
				//- 	projection: "EPSG:3857",
				//- 	units: 'm'
				//- },
				/*
				includeMapSwitcher: true,
				mapSwitcher: {
					opcionales: [
						{id: 'markers-toggle', name: 'Mostrar Mis Lugares', checked: true},
						{id: 'transporte-toggle', name: 'Mostrar Transporte Público', checked: true},
						{id: 'cortes-toggle', name: 'Mostrar Cortes de Calle', checked: false}
					],
					mapas: [
						{id: 'mapabsas_red_de_ciclovias', name: 'Red de ciclovías'}, 
						{id: 'mapabsas_codigo_de_planeamiento_urbano', name: 'Código de planeamiento urbano'} 
					],	
					onOptionToggle: function(optionId, toggle) {
						alert(optionId+(toggle?': on':': off'));					
					},				
					onMapSelection: function(mapId) {
						miMapa.setBaseLayer(mapId);
					}
					
				},*/
				// includeToolbar: false,
				// includePanZoomBar: false,
				// OpenLayersCSS: 'http://ameba.usig.gcba.gov.ar/wk/OpenLayers/theme/default/style.css',
				onReady: function() {
					miMapa.goTo(new usig.Punto(pt.x, pt.y), true);

					var markers = [
						{lat: -34.617381, lon: -58.442777, tipoAlerta: {id: 1}, desc: 'POLICIA', creationDateFormatted: '21/08 11:00'},
						{lat: -34.616003, lon: -58.446709, tipoAlerta: {id: 3}, desc: 'EMERGENCIA MEDICA', creationDateFormatted: '21/08 11:00'},
						{lat: -34.617540, lon: -58.446575, tipoAlerta: {id: 1}, desc: 'POLICIA', creationDateFormatted: '21/08 11:00'},
						{lat: -34.615134, lon: -58.445432, tipoAlerta: {id: 1}, desc: 'POLICIA', creationDateFormatted: '21/08 11:00'}
					];

					_.each(markers, function(marker){
						var point = Projection.pointFromMercator(marker.lon, marker.lat);
						//http://servicios.usig.buenosaires.gov.ar/symbols/mapabsas/bancos.png
						var iconUrl = ['/img/', marker.tipoAlerta.id,'-alert.svg'].join(''),
							iconSize = new OpenLayers.Size(41, 41),
							customMarker = new OpenLayers.Marker(
								new OpenLayers.LonLat(point.x, point.y),
								new OpenLayers.Icon(iconUrl, iconSize)
							);

							customMarker.desc = 'Mi marcador';

							miMapa.addMarker(customMarker, false, ['<b>', marker.desc, '</b><br><p>', marker.creationDateFormatted,'</p>'].join(''));

					});

					/* Ejemplo de marcador personalizado */
					/*var iconUrl = 'http://servicios.usig.buenosaires.gov.ar/symbols/mapabsas/bancos.png',
						iconSize = new OpenLayers.Size(41, 41),
						customMarker = new OpenLayers.Marker(new OpenLayers.LonLat(102224.9040681,103284.11371559),new OpenLayers.Icon(iconUrl, iconSize));
						customMarker.desc = 'Mi marcador';
					*/

					var layer = miMapa.addVectorLayer('Barrios', {
						format: 'geojson',
						url: "http://epok.buenosaires.gob.ar/getGeoLayer/?categoria=barrios&formato=geojson",
						disableClick: false,
						minScale: 150000,
						symbolizer: {
							fill: false,
							fillColor: "ee9900",
							fillOpacity: 0.1,
							strokeColor: "#999",
							strokeWidth: 2,
							strokeDashstyle: 'dashdot',
						},
						selectStyle: {
							fillOpacity: 0.5,
							fontColor: "#fff",
							fontSize: "12px",
							strokeWidth: 2
						},
						escalas: [
							{
								minScaleDenominator: 100000,
								maxScaleDenominator: 150000,
								symbolizer: {
									fill: true
								}
							},
							{
								minScaleDenominator: 60000,
								maxScaleDenominator: 100000,
								symbolizer: {
									fill: true,
									label: "${Nombre}",
									fontWeight: "bold",
									fontSize: "24px",
									fontColor: "#555"
								}
							},
							{
								maxScaleDenominator: 60000,
								symbolizer: {
									fill: false,
									label: "${Nombre}",
									fontSize: "20px",
									fontColor: "#555"
								}
							}
						],
						minPointRadius: 2,
						popup: false,
						onClick: _.noop()
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
		}//init
	};//Map

	var BubblesChart = {
		init: function(){
			//SparkLines For Cards
			$('[data-type=police]').sparkline([10,5,15,35,60,70,90,80,50,10,5,2], {type: 'bar', barColor: 'white', height: '60px', barWidth: '20px'} );
			$('[data-type=medic]').sparkline([0,0,0,0,1,3,5,4,3,2,0,0], {type: 'bar', barColor: 'white', height: '60px', barWidth: '20px'} );
			$('[data-type=violence]').sparkline([0,0,0,0,0,0,0,2,3,4,2,0], {type: 'bar', barColor: 'white', height: '60px', barWidth: '20px'} );
			$('[data-type=fireman]').sparkline([10,5,15,35,60,70,90,80,50,10,5,2], {type: 'bar', barColor: 'white', height: '60px', barWidth: '20px'} );
		}
	};

	var LinesChart = {
		init: function(){
			new Morris.Line({
				// ID of the element in which to draw the chart.
				element: 'chart',
				// Chart data records -- each entry in this array corresponds to a point on
				// the chart.
				data: [
					{ h: '00:00', policia: 2 , medico: 0 , violencia: 0 , bombero: 0 },
					{ h: '01:00', policia: 4 , medico: 0 , violencia: 0 , bombero: 0 },
					{ h: '02:00', policia: 6 , medico: 0 , violencia: 0 , bombero: 0 },
					{ h: '03:00', policia: 10 , medico: 0 , violencia: 0 , bombero: 0 },
					{ h: '04:00', policia: 5  , medico: 0 , violencia: 0 , bombero: 0},
					{ h: '05:00', policia: 3  , medico: 0 , violencia: 0 , bombero: 0},
					{ h: '06:00', policia: 3  , medico: 0 , violencia: 0 , bombero: 0},
					{ h: '07:00', policia: 1  , medico: 0 , violencia: 0 , bombero: 0},
					{ h: '08:00', policia: 0  , medico: 0 , violencia: 0 , bombero: 0},
					{ h: '09:00', policia: 0  , medico: 0 , violencia: 0 , bombero: 0},
					{ h: '10:00', policia: 0  , medico: 1 , violencia: 0 , bombero: 0},
					{ h: '11:00', policia: 1  , medico: 2 , violencia: 0 , bombero: 0},
					{ h: '12:00', policia: 2  , medico: 3 , violencia: 0 , bombero: 0},
					{ h: '13:00', policia: 5 , medico: 4 , violencia: 0 , bombero: 0 },
					{ h: '14:00', policia: 6 , medico: 2 , violencia: 0 , bombero: 0 },
					{ h: '15:00', policia: 10 , medico: 1 , violencia: 0 , bombero: 0 },
					{ h: '16:00', policia: 5 , medico: 0 , violencia: 0 , bombero: 0 },
					{ h: '17:00', policia: 1  , medico: 0 , violencia: 1 , bombero: 0},
					{ h: '18:00', policia: 1  , medico: 0 , violencia: 2 , bombero: 0},
					{ h: '19:00', policia: 2  , medico: 0 , violencia: 2 , bombero: 0},
					{ h: '20:00', policia: 5 , medico: 0 , violencia: 0 , bombero: 2 },
					{ h: '21:00', policia: 10 , medico: 0 , violencia: 0 , bombero: 3 },
					{ h: '22:00', policia: 3 , medico: 0 , violencia: 0 , bombero: 4 },
					{ h: '23:00', policia: 2 , medico: 0 , violencia: 0 , bombero: 1 }
				],
				// The name of the data record attribute that contains x-values.
				xkey: 'h',
				// A list of names of data record attributes that contain y-values.
				ykeys: ['policia', 'medico', 'violencia', 'bombero'],
				// Labels for the ykeys -- will be displayed when you hover over the
				// chart.
				labels: ['Policía', 'Emergencia Médica', 'Violencia de Género', 'Bomberos'],
				lineColors: ['#4265bc', '#6eaa2e', '#8339aa', '#ba2727'],
				fillOpacity: 0.8,
				lineWidth: 5,
				//xLabelFormat: function(x){return moment(x).format('HH:mm');},
				parseTime: false
				//goals: [30,20,10,3,2,2,2,1,1,2,3,4,5,15,25,10,10,10,5,10,15,20,25,35]
			});
		}
	};

	//Just return a new Backbone view class
	return Backbone.View.extend({
		el: $('#app-container'),
		template: Handlebars.compile($('#dashboard-template').html()),

		render: function(){
			this.$el.empty().append(this.template());

			BubblesChart.init();
			LinesChart.init();
			Projection.init();
			MapDash.init();
		}
	});
});