/* jshint node: true */
'use strict';

var setupTestsForFastboot = require('./lib/tests/setup');

module.exports = {
  name: 'ember-fastboot-addon-tests',

  includedCommands: function() {
    return {
      'fastboot:test': require('./lib/commands/fastboot-test')
    };
  },
  

  setupTestsForFastboot: setupTestsForFastboot
};
