'use strict';

const appManager = require('./app-manager');

after(function() {
  appManager.stopAll();
});