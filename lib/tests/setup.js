'use strict';

const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;
const visit = require('./visit');
const debug = require('debug')('ember-fastboot-addon-tests');
const config = require('./config');

const port = 49741;

function setupTestsForFastboot(appName, options) {

  let app;
  options = Object.assign({}, config.getOptions(), options);
  appName = appName || 'fastboot';

  before(function() {

    this.visit = function(route) {
      let url = `http://localhost:${port}${route}`;
      debug(`visiting ${url}`);
      return visit(url);
    };

    app = new AddonTestApp();
    return app.create(appName, {
      emberVersion: options.emberVersion,
      fixturesPath: options.fixturesPath
    })
      .then(function() {
        // @todo add packages from options
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