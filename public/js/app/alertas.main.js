define(['./model/alertas.model', './view/alertas.view'], function(AlertasModel, AlertasView){
	//Return the main container
	return {
		model: AlertasModel,
		template: Handlebars.compile($('#alertas-dashboard-template').html()),
		$el: null,

		render: function(){
			this.model.predicate = _.iteratee({status: 'Pendiente'});

			this.$el = this.template();
			$('#app-container').empty().append(this.$el);

			new AlertasView({
				model: this.model,
				el: '#alertas-dashboard'
			}).render();
		}
	};
})