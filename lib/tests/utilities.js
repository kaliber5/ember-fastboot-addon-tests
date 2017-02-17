'use strict';

const fs = require('fs-extra');
const path = require('path');

function readAddonEmberVersion() {
  let bowerJSONPath = path.join(findAddonPath(), 'bower.json');
  let bowerJSON = fs.readJsonSync(bowerJSONPath);

  return bowerJSON.dependencies['ember'];
}

function findAddonPath() {
  return process.cwd();
}

exports.readAddonEmberVersion = readAddonEmberVersion;