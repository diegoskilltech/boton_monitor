define([], function(){
	//Alertas Model Class
	var Model = {
		typeCssMap: {
			"2": "bg-danger-dk",
			"3": "bg-success-dk",
			"1": "bg-blue-dk",
			"4": "bg-violet-dk"
		},

		api: Config.api,

		cache: [],

		list: function(){
			var self = this;
			$.get([this.api, '/api/v1/alertas/alertas_grid/1'].join(''))
			.done(function(items){
				self.cache = items = self.parse(items);

				self.trigger('list', items);
			});

			return this;
		},

		next: function(){
			var self = this;
			$.get([this.api, '/api/v1/alertas/getNextAlerta/1/1/1'].join(''))
			.done(function(item){
				var cached = self.get(item.alerta.id);
				self.trigger('next', {item: item, cached: cached});
			});

			return this;
		},

		get: function(id){
			return _.findWhere(this.cache, {id: id});
		},

		//To parse the items to a better format
		parse: function(items){
			var self = this;

			return _.chain(items)
				.map(function(item){
					var result = _.pick(item, 'id', 'messageBody', 'status', 'idCliente', 'idConcesion', 'tipoAlerta');

					_.extend(result, 
						{
							creationDate: item.fechaAlta,
							creationDateFormatted: moment(item.fechaAlta).format('DD/MM HH:mm'),
							startDate: item.fechaInicio,
							startDateFormatted: moment(item.fechaInicio).format('DD/MM HH:mm'),
							endDate: item.fechaFin,
							closeDate: item.fechaBaja,
							updatedDate: item.fechaMod,
							typeCss: self.typeCssMap[item.tipoAlerta.id],

							user: {
								name: 'Diego Martinez',
								age: 37,
								gender: 'M',
								email: 'diegomart_2000@yahoo.com',
								tel: '2056-4296',
								cel: '15-2315-1627',
								address: 'Ortega 980, Caballito',
								city: 'CABA',
								lat: -34.617381, 
								lon: -58.442777
							}
						});

					return result;
				})
				.sortBy('creationDate')
				.reverse()
				.value();
		},

		//Will execute the list metho every 1.5 secs
		synchronize: _.once(function(){
			setInterval(_.bind(Model.list, Model), 3000);
		})
	};

	return _.extend(Model, Backbone.Events);
});