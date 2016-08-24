define([], function(){
	return Backbone.View.extend({
		//The el will be given by parent view

		template: Handlebars.compile($('#alertas-item-template').html()),

		initialize: function(){
			this.model.on('list', _.bind(this.renderItems, this));
		},

		render: function(){
			this.model.list().synchronize();
		},

		renderItems: function(items){
			var self = this;

			_.each(items, function(item){
				self.$el.find(['tr[_id=',item.id,']'].join('')).remove();
			});

			self.$el.prepend(self.template(items));
		}
	});
});