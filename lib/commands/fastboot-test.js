'use strict';

module.exports = {
  name: 'fastboot:test',
  description: 'Run your FastBoot tests',

  availableOptions: [
    {
      name: 'ember-version',
      type: String,
      description: 'Specify the Ember.js version (as in bower.json)'
    },
    {
      name: 'ember-data-version',
      type: String,
      description: 'Specify the Ember-data version (as in bower.json)'
    },
    {
      name: 'reporter',
      type: String,
      aliases: ['r'],
      description: 'Mocha test reporter to use',
      default: 'spec'
    },
    {
      name: 'timeout',
      type: Number,
      aliases: ['t'],
      description: 'Mocha test timeout (in ms)',
    }
  ],

  run(options) {
    let TestTask = require('../tasks/test');

    let testTask = new TestTask({
      ui: this.ui
    });

    return testTask.run(options);
  }
};