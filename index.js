'use strict';
// core
var fs = require('fs');
var path = require('path');
// node_modules
var xml2js = require('xml2js');

module.exports = function (context) {
    var Q = context.requireCordovaModule('q');
    return Q.npost(fs, 'readFile', [path.join(context.opts.projectRoot, 'config.xml'), 'utf8'])
        .then(function (xml) {
            return Q.npost(xml2js, 'parseString', [xml]);
        })
        .then(function (config) {
            return Q.all(config.widget.plugin.map(function (plugin) {
                return Q.npost(fs, 'stat', [path.join(context.opts.projectRoot, 'plugins', plugin.$.name)])
                    .catch(function (error) {
                        if (error.code !== 'ENOENT') {
                            throw error;
                        }
                        var options = {};
                        if (plugin.variable) {
                            options.cli_variables = {};
                            plugin.variable.forEach(function (variable) {
                                options.cli_variables[variable.$.name] = variable.$.value;
                            });
                        }
                        return Q.npost(fs, 'stat', [path.join(context.opts.projectRoot, plugin.$.spec)])
                            .then(function () {
                                options.link = true;
                            }, function () {
                                if (error.code !== 'ENOENT') {
                                    throw error;
                                }
                            })
                            .then(function () {
                                return context.cordova.plugin('add', plugin.$.name, options);
                            });
                    });
            }));
        });
};
