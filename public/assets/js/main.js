eval("(function() {\r\n\r\n'use strict';\r\n\r\nwindow.App = Ember.Application.create({\r\n\r\n\tLOG_TRANSITIONS: true, //todo Remove from production build\r\n\tLOG_TRANSITIONS_INTERNAL: true //todo Remove from production build\r\n\r\n});\r\n\r\nEmber.RSVP.configure('onerror', function(error){\r\n\tconsole.log(error);\r\n});\r\n\r\n\r\n})();//@ sourceURL=client/app/App.js")

eval("(function() {\r\n\r\n'use strict';\r\n\r\nwindow.App.Router.map(function() {\r\n\r\n\tthis.route('makeAppointmentStep2');\r\n});\r\n\r\n\r\n})();//@ sourceURL=client/app/Router.js")

eval("(function() {\r\n\r\n'use strict';\r\n\r\nwindow.App.MakeAppointmentStep2View = Ember.View.extend({\r\n\tdidInsertElement: function() {\r\n\r\n\t\tthis.$('.slider').each(function(){\r\n\t\t\tvar minValue = parseInt(Math.random()*10,10);\r\n\t\t\tvar maxValue = parseInt(Math.random()*10,10) + 10;\r\n\t\t\t$(this).slider({\r\n\t\t\t\trange: true,\r\n\t\t\t\tmin: 0,\r\n\t\t\t\tmax: 24,\r\n\t\t\t\tvalues: [ minValue, maxValue ],\r\n\t\t\t\tslide: function(event, ui ){\r\n\t\t\t\t\tvar startValue = ui.values[0];\r\n\t\t\t\t\tvar endValue = ui.values[1];\r\n\t\t\t\t\tif (startValue === endValue){\r\n\t\t\t\t\t\treturn false;\r\n\t\t\t\t\t}else if (startValue < minValue){\r\n\t\t\t\t\t\treturn false;\r\n\t\t\t\t\t}else if (endValue > maxValue){\r\n\t\t\t\t\t\treturn false;\r\n\t\t\t\t\t}\r\n\t\t\t\t}\r\n\t\t\t});\r\n\t\t});\r\n\t}\r\n});\r\n\r\n})();//@ sourceURL=client/app/views/makeAppointmentStep2View.js")