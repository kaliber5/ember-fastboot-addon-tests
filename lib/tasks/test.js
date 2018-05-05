'use strict';

const CoreObject = require('core-object');
const RSVP = require('rsvp');
const path = require('path');
const Mocha = require('mocha');
const fs = require('fs');
const debug = require('../util/debug');
const chalk = require('chalk');
const testConfig = require('../util/config');

const testDir = 'fastboot-tests';

module.exports = CoreObject.extend({

  run(options) {

    testConfig.setOptions(options);
    options = testConfig.getOptions();

    debug('run tests', options);

    let mocha = new Mocha({
      ui: 'bdd',
      reporter: options.reporter,
      timeout: options.timeout
    });

    // Look for test files
    let testFiles = fs.readdirSync(testDir)
      .filter((file) => file.substr(-3) === '.js');
    debug('Found test files:', testFiles);

    // Add the init file to mocha to setup tests
    mocha.addFile(path.resolve(__dirname, '..', 'tests', 'init.js'));

    // Add each file to the mocha instance
    testFiles.forEach((file) => mocha.addFile(path.join(testDir, file)));

    this.ui.writeLine(chalk.blue('Running FastBoot tests! This may take a while...'));

    // Run the tests.
    let run = RSVP.denodeify(mocha.run).bind(mocha);
    return run()
      .then((failures) => {
        process.on('exit', function () {
          // eslint-disable-next-line no-process-exit
          process.exit(failures);  // exit with non-zero status if there were failures
        });
      });
  }

});
