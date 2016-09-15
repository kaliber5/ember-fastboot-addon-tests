/* jshint node: true */
var expect = require('chai').expect;
var describeForFastboot = require('ember-fastboot-addon-tests').describeForFastboot;

describeForFastboot('Fastboot', function() {

  it('works', function() {
    return this.visit('/')
      .then(function(res) {
        var $ = res.jQuery;
        // var response = res.response;

        expect($('body').length).to.equal(1);
      });
  });

});