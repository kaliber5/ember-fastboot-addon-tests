var RSVP = require('rsvp');
var request = RSVP.denodeify(require('request'));
var jsdom = require('jsdom');
var jQuery = require('jquery');

// ignore external resources
jsdom.defaultDocumentFeatures = {
  FetchExternalResources: false,
  ProcessExternalResources: false
};

function visit(url) {
  return request(url)
    .then(function(response) {
      if (response.statusCode !== 200) {
        throw new Error('Fastboot server responded with status code: ' + response.statusCode);
      }

      var doc = jsdom.jsdom(response.body);
      var window = doc.defaultView;
      var jq = jQuery(window);

      return {
        response: response,
        jQuery: jq
      };
    });
}


module.exports = visit;