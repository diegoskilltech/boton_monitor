
require([], function(){
	/**
	 * Signup Form View
	 */
	var SignupFormView = Backbone.View.extend({
		el: $('#login'),

		events: {
			'click [data-action=submit]': 'onValidate'
		},

		//Init method
		initialize: function() {
		
		},


		//Do some render...
		render: function(){
			var self = this;
			self.$el.fadeIn();
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
			var user = _.reduce(form.serialize().split('&'), function(memo, field){
				var values = field.split('=');
				memo[values[0]] = unescape(values[1]);
				return memo;
			}, {});

			console.log(user);
			$.post("/signup",{user: user})
				.done(function( item ) {
					if(item.code == 200){
						window.location.href = '/dashboard';
					}else{
						form.find('[name=email]').next('.with-errors').text('El mail ingresado ya está registrado');
					}
				});
		}
	});

	/**
	 * Signin Form View
	 */
	var SigninFormView = Backbone.View.extend({
		el: $('#login-form'),

		events: {
			'click [data-action=submit]': 'onValidate'
		},

		//Do some render...
		render: function(){
			var self = this;
			self.$el.modal();

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

			console.log(user);
			$.post(Config.api + "/security/api/v1/signin/",user)
				.done(function( item ) {
					if(item.code && item.code > 400){
						form.find('[name=user]').next('.with-errors').text('La combinación de usuario y contraseña no es correcta');
					}else{
						window.location.href = '/dashboard';
					}
				});
		}
	});

	$('[data-action=login]').on('click', function(){
		new SigninFormView().render();
	});
	
	//new SignupFormView().render();
});