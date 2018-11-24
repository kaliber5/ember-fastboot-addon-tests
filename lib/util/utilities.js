'use strict';

const fs = require('fs-extra');
const path = require('path');

function bowerJsonPath() {
  return path.join(findAddonPath(), 'bower.json');
}

function bowerExists() {
  return fs.existsSync(bowerJsonPath());
}

function readAddonDependencyVersionFromBower(depName) {
  let bowerJSON = fs.readJsonSync(bowerJSONPath());

  return bowerJSON.dependencies[depName];
}

function readAddonDependencyVersionFromNpm(depName) {
  let packageJSONPath = path.join(findAddonPath(), 'package.json');
  let packageJSON = fs.readJsonSync(packageJSONPath);

  return packageJSON.devDependencies[depName] || packageJSON.dependencies[depName];
}

function readAddonEmberVersion() {
  try {
    let emberVersion = readAddonDependencyVersionFromNpm('ember-source');
    if (!emberVersion) {
      emberVersion = bowerExists() ? readAddonDependencyVersionFromBower('ember') : '*';
    }
    return emberVersion;
  }
  catch (e) {
    console.error(e);
    throw new Error('Problem getting dependency version for ember');
  }

}

function readAddonDependencyVersion(depName) {
  try {
    let depVersion = readAddonDependencyVersionFromNpm(depName);
    if (!depVersion) {
      depVersion = bowerExists() ? readAddonDependencyVersionFromBower(depName) : '*';
    }
    return depVersion;
  }
  catch (e) {
    console.error(e);
    throw new Error('Problem getting dependency version for "' + depName + '"');
  }
}

function findAddonPath() {
  return process.cwd();
}

exports.readAddonEmberVersion = readAddonEmberVersion;
exports.readAddonDependencyVersion = readAddonDependencyVersion;