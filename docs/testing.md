# Testing Tofino

## Running Tests

```
$ npm test [path]
```

The `npm test` command runs all of our test suites: unit, renderer and WebDriver tests. It optionally can take a path to a test or suite of tests.

**Disclaimer**: Test paths that target multiple test suites (`npm test test/**/*.js`) will most likely fail, and the path should only target files within a suite (`npm test test/unit/**/*.js`, or `npm test test/unit`), and if you want to run all tests, simply fire `npm test`. This is due to globbing files and running tests in the appropriate suite.

## Test Types

All tests run in a [babelified](http://babeljs.io) environment, running a [mocha](http://mochajs.org/) suite with [expect](https://www.npmjs.com/package/expect) assertions.

### Unit Tests

Unit tests are the fastest tests to run, and are encouraged over other tests if possible. These tests can directly access source components found in `app/`, `build/`, etc., and run in a node environment. We run tests on our build system, lint, profile service, and UI components.

#### Testing UI Components

The browser React app can be tested via unit tests. Explore [/test/unit/ui/browser*/](/test/unit/ui), where we have action, model, views and widget tests, having a similar directory structure to the app. For the React views, we use [enzyme](https://www.npmjs.com/package/enzyme) to test shallow renderings of the React components.

### Renderer Tests

Renderer tests use [electron-mocha](https://www.npmjs.com/package/electron-mocha) to run tests inside an Electron app's renderer process. Note, this Electron app is not ours, but just a small app that wires up the test communication, and provides our tests with an environment that is the same as what our browser app runs in, provides webviews, and Electron APIs. The browser React app is injected into the DOM before the tests run. Make sure you clean up your tests!

Renderer tests are good for testing components that require a full/real DOM to exist, testing integrations in the browser app as a whole, webviews, or anything that needs to run in a browser environment in Electron's renderer process.

### WebDriver Tests

These tests are the most involved, take the longest, and fail intermittently frequently. These should only be used to test things that must be tested and cannot be tested through other means. They use [spectron](https://github.com/electron/spectron), which wires up ChromeDriver to communicate with our built Electron app.
