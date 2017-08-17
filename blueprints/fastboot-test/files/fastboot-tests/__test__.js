/* eslint-env node, mocha */
'use strict';

const expect = require('chai').expect;
const setupTest = require('ember-fastboot-addon-tests').setupTest;

describe('<%= camelizedModuleName %>', function() {
  setupTest('<%= appName %>'/*, options */);

  it('renders', function() {
    return this.visit('/<%= url %>')
      .then(function(res) {
        let $ = res.jQuery;
        let response = res.response;

        // add your real tests here
        expect(response.statusCode).to.equal(200);
        expect($('body').length).to.equal(1);
        expect($('h1').text().trim()).to.equal('<%= camelizedModuleName %>');
      });
  });

});