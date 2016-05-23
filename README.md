# Project Tofino

[![Linux Build Status](https://travis-ci.org/mozilla/tofino.svg?branch=master)](https://travis-ci.org/mozilla/tofino)
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/7bf9bqpw24u93kjl?svg=true)](https://ci.appveyor.com/project/Mozilla/tofino-u1hv8)
[![Coverage Status](https://coveralls.io/repos/github/mozilla/tofino/badge.svg?branch=master)](https://coveralls.io/github/mozilla/tofino?branch=master)


Project Tofino is a browser interaction experiment.

The kinds of things we use browsers for on PCs and mobile devices are
different than they were when the current "tabs across the top" browsers were
designed.  We believe we can do a lot better by focusing on the tasks and
activities users engage browsers for. Project Tofino is one of our
explorations.

This project is extremely immature.  It's currently at the "OK, lets throw
some stuff together to see what happens" stage. Please adjust your
expectations accordingly.  The tools we're using are not a statement on
the set of technologies we'll use to build a final product if these ideas
pan out.  We're looking for the quickest way to build the experiments we
want, not a long-term technical strategy.

If you like a wild ride and you've got another browser for real work, we'd
love to have your comments on what works and what doesn't.  But right now
the "what works" list is a lot shorter than the "what doesn't" list, so maybe
check back in a few weeks when there's more to look at.

We blog here: https://medium.com/project-tofino

We hang out on Slack here: https://project-tofino.slack.com (you can get an invite at http://tofino-slack-invite.mozilla.io)

## Build

Project Tofino currently requires Node 6 (v6.2.0 being the current release).

### Windows

* Install Node 6: https://nodejs.org/en/
* Install Visual Studio 2013: https://www.visualstudio.com/news/vs2013-community-vs
  * Make sure you use the VS command line or otherwise have your environment variables set correctly.

### Linux

Install Node 6 through the package manager of your Linux distribution. If not available, see https://nodejs.org/en/download/.

### OSX

```
brew install python openssl sqlite nvm
nvm install 6
```

Every time you update from the git repository you may need to install or update any new node dependencies:
```
npm install
```

## Developing

* `npm start` - Runs the build in `production` mode. Should be similar to a packaged build.
* `npm run dev` - Runs the build in `development` mode with hot module reloading.
* `npm run package` - Creates a distributable package.

## Testing

Currently runs linting, unit and webdriver tests with mocha.

```
npm test
```

## Clobbering

If you have problems building or running, it might be worth deleting some generated files and then trying again.  For example:

    rm -r .electron
    rm -r node_modules
    rm build-config.json

## Contributing

Please note that this project is released with a Contributor Code of Conduct.
By participating in this project you agree to abide by its terms.

See [CONTRIBUTING.md](/CONTRIBUTING.md) for further notes.

This project is very new, so we'll probably revise these guidelines. Please
comment on a bug before putting significant effort in if you'd like to
contribute.


The code uses examples from many different places, but the foundation was
started from a set of posts from Paul Frazee:

* http://pfraze.github.io/2015/09/08/building-electron-browser-pt1.html
* https://github.com/pfraze/electron-browser


## License

This software is licensed under the Apache License Version 2.
See [LICENSE](/LICENSE) for details.
