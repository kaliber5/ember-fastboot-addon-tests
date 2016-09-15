const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;
const visit = require('./visit');
const readAddonEmberVersion = require('./utilities').readAddonEmberVersion;
const defaults = require('lodash.defaults');
const debug = require('debug')('ember-fastboot-addon-tests');

const port = 49741;

function setupTestsForFastboot(options) {

  let defaultAppOptions = {
    emberVersion: readAddonEmberVersion(),
    fixturesPath: 'fastboot-tests/fixtures',
    timeout: 600000
  };

  let app;
  let appOptions = defaults(options, defaultAppOptions);

  before(function() {
    this.timeout(appOptions.timeout);

    this.visit = function(route) {
      let url = 'http://localhost:' + port + route;
      debug('visiting ' + url);
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

}

module.exports = setupTestsForFastboot;