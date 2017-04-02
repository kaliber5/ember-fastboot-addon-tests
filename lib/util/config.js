'use strict';

const readAddonEmberVersion = require('./utilities').readAddonEmberVersion;

module.exports = {

  options: {
    reporter: 'spec',
    emberVersion: readAddonEmberVersion(),
    fixturesPath: 'fastboot-tests/fixtures',
    timeout: 600000,
    appName: 'fastboot',
    port: 49741,
    serveAssets: false
  },
  
  setOption(key, value) {
    if (typeof this.options[key] !== 'undefined') {
      this.options[key] = value;
    }
  },

  setOptions(options) {
    for (let key in options) {
      this.setOption(key, options[key]);
    }
  },

  getOption(key) {
    return this.options[key];
  },

  getOptions() {
    return this.options;
  }

};