'use strict';

const appManager = require('../util/app-manager');
const visit = require('./visit');
const debug = require('../util/debug');
const config = require('../util/config');

function setupTestsForFastboot(appName, options) {

  options = Object.assign({}, config.getOptions(), options);
  appName = appName || 'fastboot';

  before(function() {

    return appManager.start(appName, options)
      .then((app) => {
        let port = app.port;

        this.visit = function(route) {
          let url = `http://localhost:${port}${route}`;
          debug(`visiting ${url}`);
          return visit(url);
        };
      });
  });
}

module.exports = setupTestsForFastboot;