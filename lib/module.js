/* jshint node:true */
var AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;
var visit = require('./visit');
var readAddonEmberVersion = require('./utilities').readAddonEmberVersion;
var defaults = require('lodash.defaults');

var port = 49741;

var defaultAppOptions = {
  emberVersion: readAddonEmberVersion(),
  fixturesPath: 'fastboot-tests/fixtures'
};

console.log(defaultAppOptions);


function describeForFastboot(name, options, fn) {

  if (fn === undefined && typeof options === 'function') {
    fn = options;
    options = {};
  }

  describe(name, function() {
    this.timeout(300000);

    var app;
    var appOptions = defaults(options, defaultAppOptions);

    before(function() {
      this.visit = function(route) {
        var url = 'http://localhost:' + port + route;
        return visit(url);
      };

      app = new AddonTestApp();
      return app.create('fastboot', appOptions)
        .then(function() {
          return app.runEmberCommand('install', 'ember-cli-fastboot');
        })
        .then(function() {
          return app.startServer({
            command: 'fastboot',
            port: port
          });
        });

    });

    after(function() {
      return app.stopServer();
    });

    fn.call(this);
  });
}

module.exports = describeForFastboot;