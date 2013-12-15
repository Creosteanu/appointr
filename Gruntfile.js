var matchdep = require('matchdep');
var path = require('path');
var fs = require('fs');

// todo Create a separate task for styleguide and organize the build accordingly

module.exports = function(grunt) {
	'use strict';

	// load all grunt plugins from node_modules folder
	matchdep.filterAll('grunt-*').forEach(grunt.loadNpmTasks);
	grunt.loadTasks('./tasks');

	// read jshint options from file
	var jshint = JSON.parse(fs.readFileSync('./.jshintrc'));

	grunt.initConfig({
		express: {
			dev: {
				options: {
					script: 'server/server.js'
				}
			}
		},

		recess: {
			custom: {
				options: {
					compile: true
				},
				files:   {
					'public/assets/css/main.css': 'client/less/main.less'
				}
			}
		},

		neuter: {
			options: {
				includeSourceURL: true
			},
			app:     {
				options: {
					// basePath should work too, but apparently there is a bug for windows systems, so we have to do it like this
					filepathTransform: function(filePath) {
						return 'client/app/' + filePath;
					}
				},
				files:   {
					'public/assets/js/main.js': 'client/app/**/*.js'
				}
			}
		},

		jshint: {
			client: {
				options: jshint,
				src:     ['client/app/**/*.js']
			}
		},

		todos: {
			client: {
				options: {
					verbose:    false,
					priorities: {
						high: /(TODO|FIXME)/i
					}
				},
				src:     ['client/app/**/*.js']
			}
		},

		concat: {
			vendorjs:  {
				// generate warnings if input files are not found
				nonull: false,

				dest: 'public/assets/js/vendor.js',
				src:  [

					'bower_components/jquery/jquery.js',

					'bower_components/lodash/lodash.js',

					'bower_components/handlebars/handlebars.js',
					'bower_components/ember/ember.js',

					'bower_components/respond/respond.min.js'
				]
			}
		},

		ember_handlebars: {
			compile: {
				options: {
					namespace:   'Ember.TEMPLATES',
					processName: function(name) {
						var dir = path.dirname(name) + '/';
						dir = dir.replace('client/app/templates/', '');
						name = path.basename(name);
						// strip extension from file
						name = name.substr(0, name.lastIndexOf('.'));
						return dir + name;
					},

					processPartialName: function(name) {
						name = path.basename(name);
						// strip extension from file
						name = name.substr(0, name.lastIndexOf('.'));
						return name;
					}
				},
				files:   {
					'./public/assets/js/templates.js': 'client/app/**/*.hbs'
				}
			}
		},

		watch: {
			options: {
				livereload: true,
				nospawn:    true
			},

			server: {
				files: [
					'server/**/*.js'
				],
				tasks: ['express']
			},

			less: {
				files: [
					'client/less/**/*.less'
				],
				tasks: ['recess']
			},

			client: {
				files: [
					'client/app/**/*.js'
				],
				tasks: ['neuter', 'jshint']
			},

			templates: {
				files: [
					'client/app/**/*.hbs'
				],
				tasks: ['ember_handlebars']
			},

			html: {
				files: [
					'public/**/*.html'
				]
			}
		}
	});

	grunt.registerTask('clientApp', ['neuter', 'jshint', 'todos']);

	grunt.registerTask('default', ['checkmodules', 'recess', 'concat', 'ember_handlebars', 'clientApp', 'express', 'watch']);
};
