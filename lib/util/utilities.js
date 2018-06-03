'use strict';

const fs = require('fs-extra');
const path = require('path');

function readAddonEmberVersionFromBower() {
  let bowerJSONPath = path.join(findAddonPath(), 'bower.json');
  let bowerJSON = fs.readJsonSync(bowerJSONPath);

  return bowerJSON.dependencies['ember'];
}

function readAddonEmberVersionFromNpm() {
  let packageJSONPath = path.join(findAddonPath(), 'package.json');
  let packageJSON = fs.readJsonSync(packageJSONPath);

  return packageJSON.devDependencies['ember-source'] || packageJSON.dependencies['ember-source'];
}

function readAddonEmberVersion() {
  let emberVersion;
  try {
    emberVersion = readAddonEmberVersionFromNpm();
    if (!emberVersion) {
      emberVersion = readAddonEmberVersionFromBower();
    }
  }
  catch (e) {
    // catch error
  }

  return emberVersion;
}

function findAddonPath() {
  return process.cwd();
}

exports.readAddonEmberVersion = readAddonEmberVersion;