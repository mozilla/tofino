# Simple exploration into using Electron to build a browser.

The code uses examples from many different places, but the foundation was started from a set of posts from Paul Frazee:

* http://pfraze.github.io/2015/09/08/building-electron-browser-pt1.html
* https://github.com/pfraze/electron-browser

This project is extremely immature. It's currently at the "OK, lets throw some
stuff together to see what happens" stage. Please adjust your expectations
accordingly.


## Build

### Dependencies

```
brew install node --with-full-icu
npm install --global gulp-cli
```

Everytime update from the git repository you may need to install or update any new node dependencies:
```
npm install
```

### Tasks

The following `gulp` tasks are implemented.

* `run` - Runs the build. Builds the client/renderer code via webpack in `production` mode. Should be rather similar to a packaged build.
* `run-dev` - Runs the build in `development` with hot module reloading via webpack.
* `package` - Creates a distributable package. **Currently broken**. But closer to working.

The following tasks will most likely not need to be used externally, but as dependencies.

* `electron-download` - Downloads a target of electron to use. Should automatically be called after the first `npm install`, so shouldn't be needed.
* `clean-package` - Removes `./dist` directory.
* `build` - Builds the client/renderer code.
* `build-dev` - Builds the client/renderer code in development mode.


## Testing

Currently runs eslint and ui tests with mocha.

```
npm test
```

## Contributing

Please note that this project is released with a Contributor Code of Conduct.
By participating in this project you agree to abide by its terms.

See [CONTRIBUTING.md](/CONTRIBUTING.md) for further notes.

This project is very new, so we'll probably revise these guidelines. Please
comment on a bug before putting significant effort in if you'd like to
contribute.


## License

This software is licensed under the Apache License Version 2.
See [LICENSE](/LICENSE) for details.
