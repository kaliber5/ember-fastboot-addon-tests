# ember-fastboot-addon-tests

[![Greenkeeper badge](https://badges.greenkeeper.io/kaliber5/ember-fastboot-addon-tests.svg)](https://greenkeeper.io/)

[![npm version](https://badge.fury.io/js/ember-fastboot-addon-tests.svg)](https://badge.fury.io/js/ember-fastboot-addon-tests)
[![Build Status](https://travis-ci.org/kaliber5/ember-fastboot-addon-tests.svg?branch=master)](https://travis-ci.org/kaliber5/ember-fastboot-addon-tests)
[![Ember Observer Score](https://emberobserver.com/badges/ember-fastboot-addon-tests.svg)](https://emberobserver.com/addons/ember-fastboot-addon-tests)

This is an `ember-cli` addon that makes testing your own addon for compatibility with [FastBoot](https://ember-fastboot.com/) easy and straightforward!

It works by using [ember-cli-addon-tests](https://github.com/tomdale/ember-cli-addon-tests) to create a (temporary) app that
consumes your addon, builds it and spins up a local FastBoot server using [ember-cli-fastboot](https://github.com/ember-fastboot/ember-cli-fastboot),
and then runs your [Mocha](https://mochajs.org/)-based end-to-end tests to assert that your addon works as expected or at
least does not break things up in a FastBoot environment.

Note that this is for Ember *addons* only. For testing *apps* you can use this related project: [ember-fastboot-app-tests](https://github.com/kaliber5/ember-fastboot-app-tests).

## Installation

This addon depends on `ember-cli-fastboot`, so make sure you have it installed:

    ember install ember-cli-fastboot 
    
Then, install the addon:

    ember install ember-fastboot-addon-tests

Note that this addon needs at least node.js 4.x (mainly because of FastBoot itself).

After installing the addon you should find a new folder `fastboot-tests` which will hold your test files. The default
blueprint will have installed some essential things there automatically, some "[fixtures](#fixtures)" for your temporary app and a first
simple test.

## Testing principles

Before we get our hands dirty let's make some important things clear first! Because there are some significant differences
between the FastBoot tests that this addon adds support for, and the usual Ember.js tests as you might know them.

#### Ember.js tests

The normal Ember.js tests, no matter whether these are unit, integration or acceptance tests, all run in the same browser
(a real or a headless one like PhantomJS) and process as the actual code you test. So you can `import` any module from your
app/addon, you have a DOM available (where your integration or acceptance tests render into), you have jQuery and so on.

#### FastBoot tests

Contrary to that for your FastBoot tests, your test and the code to test for run in two separate processes. The FastBoot
server runs your (temporarily created) app (including the code from your addon like your components), but you can only
access that through FastBoot's HTTP server. Your test itself also runs in a node.js environment, not a browser! You can send a HTTP GET
request to your FastBoot server, and it gives you a response, that is some HTTP headers and basically a plain string of HTML.

So this is a real end to end test, like the tests you do with tools like Selenium/WebDriver. Your running app is a black
box, and you have no information about what is happening inside it, except for the HTML it returns. So no `import`, no
`document`, no DOM, no jQuery (ok, wait, I might be proven wrong there!).

## Testing basics

Let's say your addon features a component, that you want to test for FastBoot compatibility. Using that component in an app
might break the app running under FastBoot, e.g. if you access the DOM (that does not exist in FastBoot) in a hook that
FastBoot will execute, like `init` (as opposed to `didInsertElement` which FastBoot will ignore). For detailed information
on how to make your code FastBoot compatible, please consult FastBoot's [Addon Author Guide](http://ember-fastboot.com/docs/addon-author-guide)!

So our goal here is to create and run an app with FastBoot that uses our component, and make sure that it works as expected...

### Fixtures

As said in the introduction, this addon will create a temporary app with the help of `ember-cli-addon-tests`. But this app
will just be a barebones Ember.js app as `ember new` would have created it. To add any custom code to, in this case probably
a template that uses your component, so called fixtures are used. These are files in the `fastboot-tests/fixtures` folder.
These files will get copied into the created app.

Upon first installation of this addon, two fixture files will already have been created for you:

* `app/router.js`: the default router definition, to be able to amend that file later with additional routes
* `app/templates/index.hbs`: a simple index template file

### Tests

Together with those two fixtures files a simple test file to start with will have been created. It will look like this:

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

This Mocha test file defines a simple test that asserts that your app's index route returns the expected HTML that the
default `index.hbs` defines. Although this might seem not worth testing at first sight, your addon still can easily break
that, e.g. by importing some external JavaScript that can only run on a browser.

You may wonder here where all the necessary bootstrap code is, for building the app and spinning up the FastBoot server. The
good news is, you do not have to care about this, this addon takes care of this for you! All the setup and tear down code is
added to your test suite in some `before` and `after` Mocha hooks.

But you still may have stumbled upon the use of jQuery in the above test, although a chapter before it was said that you have no
DOM and no jQuery available to your tests. This is where the `visit` helper comes into play...

## The visit helper

This addon gives you a `visit` helper that makes testing pretty easy. You give it a route of your app (as you would do it
with the `visit` helper in an acceptance test) to make a request to. It then makes a HTTP request to your FastBoot server
for that route, and returns a `Promise`. The Promise will resolve with a response object, which is a POJO with the following properties:

* `response`: the node.js response (an instance of [http.IncomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage)). 
You can use that e.g. to check the HTTP headers received by accessing `response.headers`.
* `jQuery`: although the tests run in node-land and have no real DOM available, with the help of [jsdom](https://github.com/tmpvar/jsdom) - a JavaScript implementation of the DOM standard - a
kind of faked DOM is available that jQuery can operate upon. So you can express your DOM assertions in a way you are used to from normal Ember tests.

Instead of a simple URL, you can also supply an object to the `visit` helper with any options that [`request`](https://github.com/request/request#requestoptions-callback) 
would accept. For example to check for a redirect response you can do this liek this:

```js 
describe('secure', function() {
  setupTest('fastboot'/*, options */);

  it('redirects /secure to /', function() {
    return this.visit({
      uri: '/secure',
      followRedirect: false
    })
      .then(function(res) {
        let response = res.response;

        expect(response.statusCode).to.equal(307);
        expect(response.headers.location).to.match(/^http:\/\/localhost:\d+\/);
      });
  });
});
```

## Adding tests

Given the example that your addon features some components that you want to test, you should write separate routes (in your temporary FastBoot app) for each component to isolate the different
components, as a failing component would break the whole render process. Adding a new route is easy:

    ember g fastboot-test foo

This will add a new `foo.hbs` template file and register that route to your `router.js` (all in your `fastboot-tests/fixtures/fastboot/app` folder). So pretty similar to what `ember g route foo` would do
for a real app. And it would add a `foo-test.js` file with the boilerplate for your new test.

You could then add the component you want to test to your new template file, and add the DOM assertions to your test file, to check that your component will render as expected in a FastBoot environment!

If you have the need to setup different apps to test with, e.g. to add different configs to your `config/environments.js`,
you can run the blueprint with the `--app-name` option:

    ember g fastboot-test foo --app-name my-app
    
This will add a separate set of fixtures in `fastboot-tests/fixtures/my-app/` and a test file that calls `setupTest`
with that app name to run this test against the `my-app` app.

You can find some simple real world testing examples in the [ember-bootstrap](https://github.com/kaliber5/ember-bootstrap/tree/master/fastboot-tests) repository.

### Test options

The second parameter to the `setupTest` function allows you to set the following options:

* `installPackages`: install additional packages to the app. Use a hash of package name and version specifier pairs,
just as you would in the app's `package.json`
* `emberCliFastbootVersion`: specify the version of `ember-cli-fastboot` that you wnat to test your addon with. Defaults 
to 'latest'

## Running your tests

    ember fastboot:test

This will run all your FastBoot tests. *Note that this will take some time, as creating the app, installing all its dependencies and starting the FastBoot server is a slow process!*

You might want to add that command to your `npm test` script in your `package.json`, to run your FastBoot tests along your normal (ember-try) tests.

```json
"scripts": {
    "start": "ember server",
    "build": "ember build",
    "test": "ember try:each && ember fastboot:test"
}
```

### Specifying the Ember.js version

By default the FastBoot app will be created with the same Ember.js version you have specified in your addon's `bower.json`. But you can override this with an additional option:

    ember fastboot:test --ember-version <version>

You can use any version you would also specify in your `bower.json`, e.g. `release` or `2.4.0`. *Note that FastBoot itself requires at least Ember.js 2.4!*

See `ember help fastboot:test` for additional options.

### Debugging your test app

You can use the following command to serve your test app, e.g. to check your test selectors or how the fixtures behave:
 
     ember fastboot:serve
     
If you have other apps defined with other names as the default `fastboot` in your `setupTest` call, you can serve them as well:

    ember fastboot:serve --app-name <app-name>

### Working with `ember-try`

By default, addons use [`ember-try`][ember-try] to run tests against multiple versions of dependencies simultaneously on Travis CI.  This system can also be leveraged to run your FastBoot tests in parallel with your browser tests.  It just takes two small changes:

#### 1. Update your `config/ember-try.js`

Add a new entry to the file like so:

```diff
module.exports = [
+  {
+    name: 'fastboot-addon-tests',
+    command: 'ember fastboot:test',
+    bower: {
+      dependencies: { }
+    }
+  }
];
```

This will define a new `ember-try` task that runs your FastBoot tests

#### 2. Update your `.travis.yml` config

The `.travis.yml` file in the root of the addon includes a list of `ember-try` tasks to run. Just add the new one to your list:

```diff
env:
+  - EMBER_TRY_SCENARIO=fastboot-addon-tests
```

Now, you'll get a separate Travis CI job that runs just the FastBoot tests. This way, all of your test runs are not slowed down by how long they take to run. As an added bonus, running `ember try:each` will now run your FastBoot tests as well.

To see this configuration in action, check out [`ember-steps`][ember-steps].

## What else?

### ToDo

* Feature to run tests with many different Ember versions (like ember-try)
* *Anything else?*

### Contributions

To make this addon useful for as many addon authors as possible, please contribute, by giving some feedback, submitting issues or pull requests!

### Authors

[Simon Ihmig](https://github.com/simonihmig) [@simonihmig](https://twitter.com/simonihmig)

[ember-try]: https://github.com/ember-cli/ember-try
[ember-steps]: https://github.com/alexlafroscia/ember-steps/commit/195fe420ed6f2601b36a628ba0d239d5e91fe7ab
