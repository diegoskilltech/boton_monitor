define(['./alertas.list.view', './alerta.form.view'], function(AlertasListView, AlertaFormView){
	//Just return a new Backbone view class
	return Backbone.View.extend({
		render: function(){
			this.$el.on('click', '[data-action=next]', _.bind(this.model.next, this.model));

			new AlertasListView({
				el: this.$el.find('#alertas-list'), 
				model: this.model,
			}).render();

			//Model events
			this.model.on('next', _.bind(this.doNextAlert, this));
		},

		doNextAlert: function(item){
			new AlertaFormView({model: this.model}).render(item);
		}
	});
});