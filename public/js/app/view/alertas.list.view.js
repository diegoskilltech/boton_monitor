define([], function(){
	return Backbone.View.extend({
		//The el will be given by parent view
		template: Handlebars.compile($('#alertas-item-template').html()),

		initialize: function(){
			this.model.on('list', _.compose(
				_.bind(this.renderItems, this),
				_.bind(this.updateCounters, this)
			));
		},

		render: function(){
			this.model.list().synchronize();
		},

		renderItems: function(items){
			var self = this;

			if(self.$el.find('tr[_id]').attr('deleted', 'true').length){
				items = _.reduce(items, function(memo, item){
					(el = self.$el.find(['tr[_id=',item.id,']'].join('')) ).attr('deleted', null);
					if(!el.length) memo.push(item);
					return memo;
				}, []);
			}

			self.$el.find('tr[deleted=true]').remove();
			self.$el.prepend(self.template(items));

			return items;
		},

		updateCounters: function(items){
			var self = this;

			var byStatus = _.countBy(items, 'status');
			var byType = _.countBy(items, function(item){
				return item.tipoAlerta.descripcion;
			});

			_.each(byStatus, function(value, key){
				$('[data-counter="' + key + '"]').text(value);
			});

			_.each(byType, function(value, key){
				$('[data-counter="' + key + '"]').text(value);
			});

			return items;
		}
	});
});