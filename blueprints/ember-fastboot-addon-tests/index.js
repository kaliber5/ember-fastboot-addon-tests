/*jshint node:true*/
module.exports = {
  description: '',

  normalizeEntityName() {
  },

  afterInstall() {
    return this.addPackageToProject('chai');
  }
};
