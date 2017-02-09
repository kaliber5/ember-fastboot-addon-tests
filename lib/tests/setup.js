'use strict';

const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;
const visit = require('./visit');
const debug = require('debug')('ember-fastboot-addon-tests');

const port = 49741;

function setupTestsForFastboot(options) {

  let app;

  before(function() {

    this.visit = function(route) {
      let url = `http://localhost:${port}${route}`;
      debug(`visiting ${url}`);
      return visit(url);
    };

    app = new AddonTestApp();
    return app.create('fastboot', options)
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