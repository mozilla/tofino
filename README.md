# Project Tofino

[![Linux Build Status](https://travis-ci.org/mozilla/tofino.svg?branch=master)](https://travis-ci.org/mozilla/tofino)
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/7bf9bqpw24u93kjl?svg=true)](https://ci.appveyor.com/project/Mozilla/tofino-u1hv8)
[![Coverage Status](https://coveralls.io/repos/github/mozilla/tofino/badge.svg?branch=master)](https://coveralls.io/github/mozilla/tofino?branch=master)


Project Tofino is a browser interaction experiment.

The kinds of things we use browsers for on PCs and mobile devices are different
than they were when the current "tabs across the top" browsers were designed.
We believe we can do a lot better by focusing on the tasks and activities users
engage browsers for. Project Tofino is one of our explorations.

This project is extremely immature. It's currently at the "OK, lets throw some
stuff together to see what happens" stage. Please adjust your expectations
accordingly. The tools we're using are not a statement on the set of
technologies we'll use to build a final product if these ideas pan out. We're
looking for the quickest way to build the experiments we want, not a long-term
technical strategy.

If you like a wild ride and you've got another browser for real work, we'd love
to have your comments on what works and what doesn't. But right now the "what
works" list is a lot shorter than the "what doesn't" list, so maybe check back
in a few weeks when there's more to look at.

We blog here: https://medium.com/project-tofino

We hang out on Slack here: https://project-tofino.slack.com (you can get an
invite at http://tofino-slack-invite.mozilla.io)

## Build

Documentation for building is found in [docs/building.md](/docs/building.md).

## Developing

* `npm start` - Runs the build in `production` mode. Should be similar to a
packaged build.
* `npm run dev` - Runs the build in `development` mode with hot module
reloading.
* `npm run package` - Creates a distributable package.
* `npm run clobber` - Destroys a handful of temporary files (electron build,
node modules, configurations) to clean up invalid states. If running into
strange issues, try this command, followed by an `npm install`.

Even though the user agent and content services are reused between multiple
browser instances, they don't outlive their parent process by default when it
exits, to ease development. To have them kept alive even when there are no more
clients left, `npm run serve` will start these services standalone for finer
lifetime control.

## Testing

Currently runs linting, unit and webdriver tests with mocha.

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


The code uses examples from many different places, but the foundation was
started from a set of posts from Paul Frazee:

* https://github.com/pfrazee/pfrazee.github.io/blob/moreaboutp2p/_posts/2015-09-08-building-electron-browser-pt1.md
* https://github.com/pfraze/electron-browser


## License

This software is licensed under the Apache License Version 2.
See [LICENSE](/LICENSE) for details.
