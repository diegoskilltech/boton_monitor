define(['./model/alertas.model', './view/alertas.view'], function(AlertasModel, AlertasView){
	//Return the main container
	return {
		model: AlertasModel,

		template: Handlebars.compile($('#despachos-dashboard-template').html()),

		render: function(){
			this.model.predicate = function(item){
				return item.status != 'Pendiente';
			};

			var el = this.template();
			$('#app-container').empty().append(el);

			new AlertasView({
				model: this.model,
				el: '#alertas-dashboard'
			}).render();
		}
	};
})