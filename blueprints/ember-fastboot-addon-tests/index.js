/*jshint node:true*/
'use strict';

module.exports = {
  description: '',

  normalizeEntityName() {
  },

  afterInstall() {
    return this.addPackageToProject('chai');
  }
};
