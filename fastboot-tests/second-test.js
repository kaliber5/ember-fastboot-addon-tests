'use strict';

const expect = require('chai').expect;
const setupTest = require('../lib/tests/setup');

describe('second', function() {
  setupTest('second', {
    installPackages: {
      'ember-bootstrap': '1.2.1'
    }
  });

  it('renders', function() {
    return this.visit('/')
      .then(function(res) {
        let $ = res.jQuery;
        let response = res.response;

        // add your real tests here
        expect(response.statusCode).to.equal(200);
        expect($('body').length).to.equal(1);
        expect($('h1').text().trim()).to.equal('second');
        expect($('#ember-bootstrap-wormhole').length).to.equal(1);

      });
  });

});