'use strict';

var createValues = function(slider,min,max){
	var handles = slider.find('.ui-slider-handle');
	handles.first().append($('<div>').text(min));
	handles.last().append($('<div>').text(max));
};

var setValues = function(slider,min,max){
	var handles = slider.find('.ui-slider-handle');
	handles.first().find('div').text(min);
	handles.last().find('div').text(max);
};

var checkPossibility = function(scope){
	var dates = scope.$('table tr').first().find('td').length;
	for(var i = 0; i < dates; i++){
		var values = [];
		var child = i + 2;
		var selector = 'table tr:not(.summary) td:nth-child(' + child + ') .slider';
		var summarySelectorMessage = 'table tr.summary td:nth-child(' + child + ') .message';
		var summarySelectorSlider = 'table tr.summary td:nth-child(' + child + ') .slider';

		scope.$(selector).each(function(i,item){
			values.push($(item).slider('values'));
		});
		var summaryValues = [];
		for (var j = 1; j < values.length ; j++){
			var prevValues = values[j - 1];
			var actualValues = values[j];
			summaryValues[0] = actualValues[0];
			if (prevValues[0] >= actualValues[0]){
				summaryValues[0] = prevValues[0];
			}
			summaryValues[1] = actualValues[1];
			if (prevValues[1] <= actualValues[1]){
				summaryValues[1] = prevValues[1];
			}
		}
		var summarySlider = scope.$(summarySelectorSlider);
		var summaryMessage = scope.$(summarySelectorMessage);
		if (summaryValues[0] >= summaryValues[1]){
			summaryMessage.show();
			summarySlider.hide();
		}else{
			summaryMessage.hide();
			summarySlider.show();
			summarySlider.slider('option','values',[summaryValues[0],summaryValues[1]]);
			setValues(summarySlider,summaryValues[0],summaryValues[1]);
		}
	}
};



window.App.MakeAppointmentStep2View = Ember.View.extend({
	didInsertElement: function() {

		var self = this;
		this.$('tr.summary .slider').slider({
			range: true,
			min: 0,
			max: 24,
			values: [ 0, 24 ],
			disabled: true,
			create: function() {
				createValues($(this),0,24);
			}
		});
		this.$('tr:not(.summary) .slider').each(function initSlider(){
			var slider = $(this);
			var minValue = parseInt(Math.random()*10,10);
			var maxValue = parseInt(Math.random()*10,10) + 10;
			slider.slider({
				range: true,
				min: 0,
				max: 24,
				values: [ minValue, maxValue ],
				create: function() {
					createValues(slider,minValue,maxValue);
				},
				slide: function(event, ui ){
					var startValue = ui.values[0];
					var endValue = ui.values[1];
					if (startValue === endValue){
						return false;
					}else if (startValue < minValue){
						return false;
					}else if (endValue > maxValue){
						return false;
					}else{
						setValues(slider,startValue,endValue);
					}
				},
				change: function(){
					checkPossibility(self);
				}
			});
		});
		checkPossibility(self);
	}
});