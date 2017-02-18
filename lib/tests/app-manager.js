'use strict';

const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;
const RSVP = require('rsvp');
const debug = require('./debug');

const defaultPort = 49741;

class AppManager {
  constructor() {
    this.apps = [];
  }

  start(appName, options) {
    let app = this.getApp(appName);
    if (app) {
      debug(`Existing FastBoot test app "${appName}"`);
      return RSVP.resolve(app);
    }

    let port = defaultPort + this.apps.length;
    app = new AddonTestApp();

    debug(`Creating FastBoot test app "${appName}"`);
    return app.create(appName, {
      emberVersion: options.emberVersion,
      fixturesPath: options.fixturesPath
    })
      .then(function() {
        // @todo add packages from options
        return app.runEmberCommand('install', 'ember-cli-fastboot');
      })
      .then(function() {
        debug(`Starting FastBoot test app "${appName}" at port ${port}`);
        return app.startServer({
          command: 'fastboot',
          port
        });
      })
      .then(() => {
        let appInstance = {
          appName,
          app,
          port
        };
        this.apps.push(appInstance);
        return appInstance;
      });
  }

  stop(app) {
    let index = this.apps.indexOf(item);
    if (index === -1) {
      throw new Error('App not found');
    }
    debug(`Stopping FastBoot test app "${app.appName}"`);

    this.apps.splice(index, 1);
    app.app.stopServer();
  }

  stopAll() {
    debug('Stopping all FastBoot apps');

    this.apps.forEach((app) => {
      app.app.stopServer();
    });
    this.apps = [];
  }

  getApp(appName) {
    return this.apps.find((app) => app.appName === appName);
  }

}

module.exports = new AppManager();