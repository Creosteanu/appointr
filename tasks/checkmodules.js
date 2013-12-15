/*

    checkmodules.js - Checks if all required npm/bower modules are installed
    Status: initial, no code review
    
*/

var matchdep = require('matchdep');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

module.exports = function(grunt) {

    function cwd(name) {
        return path.resolve(process.cwd(), name);
    }

    function getUnreferencedModules(config, directory) {
        var refs = matchdep.filterAll('*', cwd(config));

        // check for unused
        var existing = fs.readdirSync(directory);
        var unused = _.without.apply(this, [existing].concat(refs));

        // remove directories starting with a . (i.ex. .bin)
        unused = _.filter(unused, function(item) { return item[0]!=='.'; });

        return unused;
    }

    function getMissingModules(config, directory) {

        var refs = matchdep.filterAll('*', cwd(config));

        var result = _.filter(refs, function(item) {
            return !fs.existsSync(path.join(directory, item));
        });

        return result;
    }

    grunt.registerTask('checkmodules', function() {

        // check for missing npm modules

        var missingNpm = getMissingModules('package.json', 'node_modules');

        missingNpm.forEach(function(name) {
            grunt.fail.warn("Did not find node module "+name+".. maybe do a 'npm install'?");
        });

        // check for missing bower modules

        var missingBower = getMissingModules('bower.json', 'bower_components');
        missingBower.forEach(function(name) {
            grunt.fail.warn("Did not find bower package "+name+".. maybe do a 'bower install'?");
        });

        var found = false;

        var unusedNpm = getUnreferencedModules('package.json', 'node_modules');

        unusedNpm.forEach(function(item) {
            grunt.log.error('Unused NPM module: '+item.red);
            found = true;
        });


        var unusedBower = getUnreferencedModules('bower.json', 'bower_components');
        unusedBower.forEach(function(item) {
            grunt.log.error('Unused bower component: '+item.red);
            found = true;
        });


        if (found) {
            grunt.log.warn('Run "grunt cleanmodules" to remove unneeded modules'.cyan);
        }

    });

    grunt.registerTask('cleanmodules', function() {

        var done = this.async();

        grunt.util.spawn({
            cmd: 'npm',
            args: ['prune']
        }, function(error, result) {
            if (error!==null) {
                grunt.fail.warn(result.toString());
            }

            grunt.log.writeln(result.toString());

            grunt.util.spawn({
                cmd: 'bower',
                args: ['prune']
            }, function(error, result) {
                if (error!==null) {
                    grunt.fail.warn(result.toString());
                }

                grunt.log.writeln(result.toString());
                done();
            });
        });
    });
};