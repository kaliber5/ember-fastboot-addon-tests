'use strict';

const expect = require('chai').expect;

describe('<%= camelizedModuleName %>', function() {

  it('renders', function() {
    return this.visit('/<%= camelizedModuleName %>')
      .then(function(res) {
        let $ = res.jQuery;
        // let response = res.response;

        // add your real tests here
        expect($('body').length).to.equal(1);
        expect($('h1').text().trim()).to.equal('<%= camelizedModuleName %>');
      });
  });

});