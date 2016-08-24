define(['./model/alertas.model', './view/alertas.view'], function(AlertasModel, AlertasView){
	//Return the main container
	return {
		model: AlertasModel,

		render: function(){
			new AlertasView({model: this.model}).render();
		}
	};
})