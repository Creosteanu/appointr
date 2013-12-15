'use strict';

window.App = Ember.Application.create({

	LOG_TRANSITIONS: true, //todo Remove from production build
	LOG_TRANSITIONS_INTERNAL: true //todo Remove from production build

});

Ember.RSVP.configure('onerror', function(error){
	console.log(error);
});
