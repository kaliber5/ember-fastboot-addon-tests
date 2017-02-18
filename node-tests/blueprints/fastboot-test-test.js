'use strict';

const blueprintHelpers = require('ember-cli-blueprint-test-helpers/helpers');
const setupTestHooks = blueprintHelpers.setupTestHooks;
const emberNew = blueprintHelpers.emberNew;
const emberGenerate = blueprintHelpers.emberGenerate;
const emberDestroy = blueprintHelpers.emberDestroy;

const chai = require('ember-cli-blueprint-test-helpers/chai');
const file = chai.file;
const expect = chai.expect;

describe('Acceptance: ember generate and destroy fastboot-test', function() {
  setupTestHooks(this);

  it('fastboot-test foo', function() {
    let args = ['fastboot-test', 'foo'];

    return emberNew()
      .then(() => emberGenerate(args))
      .then(() => {
        expect(file('fastboot-tests/foo-test.js'))
          .to.contain('setupTest(\'fastboot\'/*, options */);')
          .to.contain('return this.visit(\'/foo\')');

        expect(file('fastboot-tests/fixtures/fastboot/app/router.js'))
          .to.contain('this.route(\'foo\')');

        expect(file('fastboot-tests/fixtures/fastboot/app/templates/foo.hbs'))
          .to.contain('<h1>foo</h1>');
      })
      .then(() => emberDestroy(args))
      .then(() => {
        expect(file('fastboot-tests/foo-test.js')).to.not.exist;
        expect(file('fastboot-tests/fixtures/fastboot/app/router.js')).to.exist; // router.js is not deleted
        expect(file('fastboot-tests/fixtures/fastboot/app/templates/foo.hbs')).to.not.exist;
      });
  });

  it('fastboot-test foo/bar', function() {
    let args = ['fastboot-test', 'foo/bar'];

    return emberNew()
      .then(() => emberGenerate(args))
      .then(() => {
        expect(file('fastboot-tests/foo/bar-test.js'))
          .to.contain('setupTest(\'fastboot\'/*, options */);')
          .to.contain('return this.visit(\'/foo/bar\')');

        expect(file('fastboot-tests/fixtures/fastboot/app/router.js'))
          .to.contain('this.route(\'foo\', function() {')
          .to.contain('this.route(\'bar\')');

        expect(file('fastboot-tests/fixtures/fastboot/app/templates/foo/bar.hbs'))
          .to.contain('<h1>fooBar</h1>');
      })
      .then(() => emberDestroy(args))
      .then(() => {
        expect(file('fastboot-tests/foo/bar-test.js')).to.not.exist;
        expect(file('fastboot-tests/fixtures/fastboot/app/router.js')).to.exist; // router.js is not deleted
        expect(file('fastboot-tests/fixtures/fastboot/app/templates/foo/bar.hbs')).to.not.exist;
      });
  });

  it('fastboot-test foo --app-name test', function() {
    let args = ['fastboot-test', 'foo', '--app-name', 'test'];

    return emberNew()
      .then(() => emberGenerate(args))
      .then(() => {
        expect(file('fastboot-tests/foo-test.js'))
          .to.contain('setupTest(\'test\'/*, options */);')
          .to.contain('return this.visit(\'/foo\')');

        expect(file('fastboot-tests/fixtures/test/app/router.js'))
          .to.contain('this.route(\'foo\')');

        expect(file('fastboot-tests/fixtures/test/app/templates/foo.hbs'))
          .to.contain('<h1>foo</h1>');
      })
      .then(() => emberDestroy(args))
      .then(() => {
        expect(file('fastboot-tests/foo-test.js')).to.not.exist;
        expect(file('fastboot-tests/fixtures/test/app/router.js')).to.exist; // router.js is not deleted
        expect(file('fastboot-tests/fixtures/test/app/templates/foo.hbs')).to.not.exist;
      });
  });
});
