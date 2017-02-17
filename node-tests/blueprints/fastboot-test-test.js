'use strict';

const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const setupTestHooks = blueprintHelpers.setupTestHooks;
const emberNew = blueprintHelpers.emberNew;
const emberGenerate = blueprintHelpers.emberGenerate;
const emberDestroy = blueprintHelpers.emberDestroy;

const chai = require('ember-cli-blueprint-test-helpers/chai');
const file = chai.file;
const expect = chai.expect;

const defaultBlueprintArgs = ['ember-fastboot-addon-tests', 'dummy'];

describe('Acceptance: ember generate and destroy fastboot-test', function() {
  setupTestHooks(this);

  it('fastboot-test foo', function() {
    let args = ['fastboot-test', 'foo'];

    return emberNew()
      .then(() => emberGenerate(defaultBlueprintArgs))
      .then(() => emberGenerate(args))
      .then(() => {
        expect(file('fastboot-tests/foo-test.js'))
          .to.contain('return this.visit(\'/foo\')');

        expect(file('fastboot-tests/fixtures/fastboot/app/router.js'))
          .to.contain('this.route(\'foo\')');
      })
      .then(() => emberDestroy(args))
      .then(() => emberDestroy(defaultBlueprintArgs));
  });

  it('fastboot-test foo/bar', function() {
    let args = ['fastboot-test', 'foo/bar'];

    return emberNew()
      .then(() => emberGenerate(defaultBlueprintArgs))
      .then(() => emberGenerate(args))
      .then(() => {
        expect(file('fastboot-tests/foo/bar-test.js'))
          .to.contain('return this.visit(\'/foo/bar\')');

        expect(file('fastboot-tests/fixtures/fastboot/app/router.js'))
          .to.contain('this.route(\'foo\', function() {')
          .to.contain('this.route(\'bar\')');
      })
      .then(() => emberDestroy(args))
      .then(() => emberDestroy(defaultBlueprintArgs));
  });
});
