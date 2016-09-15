'use strict';

module.exports = {
  name: 'fastboot:test',
  description: 'Run your Fastboot tests',

  availableOptions: [
    {
      name: 'ember-version',
      type: String,
      description: 'Specify the Ember.js version (as in bower.json)'
    },
    {
      name: 'reporter',
      type: String,
      aliases: ['r'],
      description: 'Mocha test reporter to use',
      default: 'spec'
    }
  ],

  run: function(options) {
    let TestTask = require('../tasks/test');

    let testTask = new TestTask({
      ui: this.ui
    });

    return testTask.run(options);
  }
};