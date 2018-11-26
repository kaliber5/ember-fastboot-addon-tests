'use strict';

module.exports = {
  name: 'fastboot:serve',
  description: 'Serve your FastBoot test app',

  availableOptions: [
    {
      name: 'app-name',
      type: String,
      aliases: ['app'],
      default: 'fastboot',
      description: 'Specify the app name as defined in your tests'
    },
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
      name: 'serve-assets',
      type: Boolean,
      default: false
    }
  ],

  run(options) {
    let ServeTask = require('../tasks/serve');

    let serveTask = new ServeTask({
      ui: this.ui
    });

    return serveTask.run(options);
  }
};