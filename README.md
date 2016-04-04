# Simple exploration into using Electron to build a browser.

The code uses examples from many different places, but the foundation was started from a set of posts from Paul Frazee:

* http://pfraze.github.io/2015/09/08/building-electron-browser-pt1.html
* https://github.com/pfraze/electron-browser


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

## Landing code

Please note that this project is released with a Contributor Code of Conduct.
By participating in this project you agree to abide by its terms.

Use squashed merge by preference.

Make sure your commit message references the issue or bug number, if there is one, identifies the reviewers, and follows a readable style, with the long description including any additional information that's likely to help future spelunkers. For example:

```
    Issue #6 - Frobnicate the URL bazzer before flattening pilchard. r=mossop,rnewman

    The frobnication method used is as described in Podder's Miscellany, page 15.
    Note that this pull request doesn't include tests, because we're bad people.
```


## License
