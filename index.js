/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-fastboot-addon-tests',

  includedCommands: function() {
    return {
      'fastboot:test': require('./lib/commands/fastboot-test')
    };
  }
};
