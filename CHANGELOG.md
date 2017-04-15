<a name"0.3.0"></a>
### 0.3.0 (2017-04-02)

* added `ember fastboot:serve` command to directly run your FastBoot test app


<a name"0.2.0"></a>
### 0.2.0 (2017-02-19)

* fixed nested route blueprint
* added --app-name option to fastboot-test blueprint to generate test for different test app
* support adding additional packages to test app

**BREAKING CHANGES**

* Visit helper does not implicitly test for response status code of 200 anymore.
    You have to add that assertions to your own tests where needed.
* Setup of tests changed, you have to call `setupTest` inside your `describe` function

Before:

```js
var expect = require('chai').expect;

describe('index', function() {

  it('renders', function() {
    return this.visit('/')
      .then(function(res) {
        var $ = res.jQuery;
        // var response = res.response;

        // add your real tests here
        expect($('body').length).to.equal(1);
        expect($('h1').text().trim()).to.equal('ember-fastboot-addon-tests');
      });
  });

});
```

After:

```js
const expect = require('chai').expect;
const setupTest = require('ember-fastboot-addon-tests').setupTest;

describe('index', function() {
  setupTest('fastboot'/*, options */);

  it('renders', function() {
    return this.visit('/')
      .then(function(res) {
        let $ = res.jQuery;
        let response = res.response;

        // add your real tests here
        expect(response.statusCode).to.equal(200);
        expect($('body').length).to.equal(1);
        expect($('h1').text().trim()).to.equal('ember-fastboot-addon-tests');
      });
  });

});
```


<a name"0.1.0"></a>
### 0.1.0 (2016-09-24)

* Initial release