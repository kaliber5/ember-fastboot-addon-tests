/* jshint node: true */
var expect = require('chai').expect;
var describeForFastboot = require('ember-fastboot-addon-tests').describeForFastboot;

describeForFastboot('Fastboot', function() {

  it('renders', function() {
    return this.visit('/')
      .then(function(response) {
        expect(response.statusCode).to.equal(200);
      });
  });

});