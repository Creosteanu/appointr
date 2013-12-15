'use strict';

window.App.MakeAppointmentStep2View = Ember.View.extend({
	didInsertElement: function() {

		this.$('.slider').each(function(){
			var minValue = parseInt(Math.random()*10,10);
			var maxValue = parseInt(Math.random()*10,10) + 10;
			$(this).slider({
				range: true,
				min: 0,
				max: 24,
				values: [ minValue, maxValue ],
				slide: function(event, ui ){
					var startValue = ui.values[0];
					var endValue = ui.values[1];
					if (startValue === endValue){
						return false;
					}else if (startValue < minValue){
						return false;
					}else if (endValue > maxValue){
						return false;
					}
				}
			});
		});
	}
});