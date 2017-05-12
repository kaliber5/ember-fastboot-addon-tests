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

        this.visit = function(requestOptions) {
          let url = requestOptions;
          if (typeof requestOptions === 'object') {
            url = requestOptions.uri || requestOptions.url;

            if (requestOptions.headers
              && requestOptions.headers.Accept
              && requestOptions.headers.Accept.indexOf('text/html')) {
              throw new Error('Accept header must include \'text/html\'');
            }
          }
          if (typeof url === 'undefined') {
            throw new Error('visit helper was called without URL. Either pass a string or an object containing an `url` key.');
          }

          if (!url.match(/^https?:\/\//)) {
            let host = `http://localhost:${port}`;
            let separator = url.charAt(0) === '/' ? '' : '/';
            url = host + separator + url;
          }

          requestOptions = Object.assign({}, typeof requestOptions === 'object' ? requestOptions : {}, { url });
          delete requestOptions.uri;
          requestOptions.headers = requestOptions.headers || {};
          if (!requestOptions.headers.Accept) {
            // We have to send the `Accept` header so the ember-cli server sees this as a request to `index.html` and sets
            // `req.serveUrl`, that ember-cli-fastboot needs in its middleware
            // See https://github.com/ember-cli/ember-cli/blob/master/lib/tasks/server/middleware/history-support/index.js#L55
            // and https://github.com/ember-fastboot/ember-cli-fastboot/blob/master/index.js#L160
            requestOptions.headers.Accept = 'text/html';
          }

          debug(`visiting ${url}`, requestOptions);
          return visit(requestOptions);
        };

      });
  });
}

module.exports = setupTestsForFastboot;