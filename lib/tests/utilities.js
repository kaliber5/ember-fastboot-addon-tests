'use strict';

const fs = require('fs-extra');
const findup = require('findup-sync');
const path = require('path');

function readAddonEmberVersion() {
  let bowerJSONPath = path.join(findAddonPath(), 'bower.json');
  let bowerJSON = fs.readJsonSync(bowerJSONPath);

  return bowerJSON.dependencies['ember'];
}

function findAddonPath() {
  let packageJSONPath = findup('package.json', {
    cwd: path.join(__dirname, '../../..')
  });
  return path.dirname(packageJSONPath);
}

exports.readAddonEmberVersion = readAddonEmberVersion;