/* jshint node: true */
'use strict';

const setupTest = require('./lib/tests/setup');

module.exports = {
  name: 'ember-fastboot-addon-tests',

  includedCommands() {
    return {
      'fastboot:test': require('./lib/commands/fastboot-test'),
      'fastboot:serve': require('./lib/commands/fastboot-serve')
    };
  },

  setupTest: setupTest
};
