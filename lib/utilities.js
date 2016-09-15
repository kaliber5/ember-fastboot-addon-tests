/* jshint node:true */
var fs = require('fs-extra');
var findup = require('findup-sync');
var path = require('path');

function readAddonEmberVersion() {
  var bowerJSONPath = path.join(findAddonPath(), 'bower.json');
  var bowerJSON = fs.readJsonSync(bowerJSONPath);

  return bowerJSON.dependencies['ember'];
}

function findAddonPath() {
  var packageJSONPath = findup('package.json', {
    cwd: path.join(__dirname, '../..')
  });
  return path.dirname(packageJSONPath);
}

exports.readAddonEmberVersion = readAddonEmberVersion;