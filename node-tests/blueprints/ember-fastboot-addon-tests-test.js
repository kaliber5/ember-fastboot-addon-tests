'use strict';

const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const setupTestHooks = blueprintHelpers.setupTestHooks;
const emberNew = blueprintHelpers.emberNew;
const emberGenerateDestroy = blueprintHelpers.emberGenerateDestroy;

const expect = require('ember-cli-blueprint-test-helpers/chai').expect;

describe('Acceptance: ember generate and destroy ember-fastboot-addon-tests', function() {
  setupTestHooks(this);

  it('ember-fastboot-addon-tests', function() {
    let args = ['ember-fastboot-addon-tests', 'foo'];

    // pass any additional command line options in the arguments array
    return emberNew()
      .then(() => emberGenerateDestroy(args, (file) => {
        expect(file('fastboot-tests/fixtures/fastboot/app/router.js'))
          .to.contain('Router.map(function() {');

        expect(file('fastboot-tests/index-test.js'))
          .to.contain('setupTest(\'fastboot\'/*, options */);')
          .to.contain('return this.visit(\'/\')');

        expect(file('fastboot-tests/fixtures/fastboot/app/templates/index.hbs'))
          .to.contain('<h1>ember-fastboot-addon-tests</h1>');
    }));
  });
});
