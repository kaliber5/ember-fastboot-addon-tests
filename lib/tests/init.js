'use strict';

const appManager = require('../util/app-manager');

after(function() {
  appManager.stopAll();
});