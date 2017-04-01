'use strict';

const CoreObject = require('core-object');
const debug = require('../util/debug');
const config = require('../util/config');
const chalk = require('chalk');
const RSVP = require('rsvp');

const appManager = require('../util/app-manager');

module.exports = CoreObject.extend({

  run(options) {

    config.setOptions(options);
    options = config.getOptions();

    let appName = options.appName;

    debug('serve app', options);

    this.ui.writeLine(chalk.blue(`Starting FastBoot test app "${appName}". This may take a while...`));

    return appManager.start(appName, options)
      .then(() => {
        this.ui.writeLine(chalk.blue(`FastBoot test app "${appName}" started, running at http://localhost:${options.port}`));
      })
      .then(() => new RSVP.Promise((resolve) => {
        process.on('SIGINT', () => {
          appManager
            .stopAll()
            .then(resolve);
        });
      }));
  }

});
