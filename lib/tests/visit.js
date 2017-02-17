'use strict';

const RSVP = require('rsvp');
const request = RSVP.denodeify(require('request'));
const jsdom = require('jsdom');
const jQuery = require('jquery');

// ignore external resources
jsdom.defaultDocumentFeatures = {
  FetchExternalResources: false,
  ProcessExternalResources: false
};

function visit(url) {
  return request(url)
    .then(function(response) {
      let doc = jsdom.jsdom(response.body);
      let window = doc.defaultView;
      let jq = jQuery(window);

      return {
        response: response,
        jQuery: jq
      };
    });
}

module.exports = visit;