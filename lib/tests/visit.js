'use strict';

const RSVP = require('rsvp');
const request = RSVP.denodeify(require('request'));
const jsdom = require('jsdom');
const jQuery = require('jquery');

const { JSDOM } = jsdom;

// ignore external resources
jsdom.defaultDocumentFeatures = {
  FetchExternalResources: false,
  ProcessExternalResources: false
};

function visit(opts) {
  return request(opts)
    .then(function(response) {
      let result = {
        response
      };

      let contentType = response.headers['content-type'];
      if (contentType && contentType.match(/^text\/html/)) {
        let { window } = new JSDOM(response.body);
        let jq = jQuery(window);
        result.jQuery = jq;
      }

      return result;
    });
}

module.exports = visit;