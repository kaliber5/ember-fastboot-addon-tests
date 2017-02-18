/*jshint node:true*/
'use strict';

const fs          = require('fs-extra');
const path        = require('path');
const chalk       = require('chalk');
const EmberRouterGenerator = require('ember-router-generator');

module.exports = {
  description: 'Generate a FastBoot test with a custom route/template added to the temporary app',

  availableOptions: [
    {
      name: 'app-name',
      type: String,
      default: 'fastboot'
    }
  ],

  locals(options) {
    let packageName = options.project.name();
    let moduleName = (options.entity && options.entity.name) || packageName;

    return {
      url: moduleName,
      appName: options.appName
    };
  },

  fileMapTokens: function() {
    return {
      __appName__: function(options) {
        return options.locals.appName;
      }
    };
  },

  shouldEntityTouchRouter(name) {
    let isIndex = name === 'index';
    let isBasic = name === 'basic';
    let isApplication = name === 'application';

    return !isBasic && !isIndex && !isApplication;
  },

  afterInstall(options) {
    updateRouter.call(this, 'add', options);
  },

  afterUninstall(options) {
    updateRouter.call(this, 'remove', options);
  },

  files() {
    let files = this._super();
    if (this.options) {
      let routerFile = `fastboot-tests/fixtures/${this.options.appName}/app/router.js`;
      let routerBlueprintFile = 'fastboot-tests/fixtures/__appName__/app/router.js';
      if (fs.existsSync(routerFile)) {
        files = files.filter((file) => file !== routerBlueprintFile);
      }
    }
    return files;
  }
};

function updateRouter(action, options) {
  let entity = options.entity;
  let actionColorMap = {
    add: 'green',
    remove: 'red'
  };
  let color = actionColorMap[action] || 'gray';

  if (this.shouldEntityTouchRouter(entity.name, options)) {
    writeRoute(action, entity.name, options);

    this.ui.writeLine('updating router fixture');
    this._writeStatusToUI(chalk[color], action + ' route', entity.name);
  }
}

function findRouter(options) {
  return [options.project.root, 'fastboot-tests', 'fixtures', options.appName, 'app', 'router.js'];
}

function writeRoute(action, name, options) {
  let routerPath = path.join.apply(null, findRouter(options));
  let source = fs.readFileSync(routerPath, 'utf-8');

  let routes = new EmberRouterGenerator(source);
  let newRoutes = routes[action](name, options);

  fs.writeFileSync(routerPath, newRoutes.code());
}