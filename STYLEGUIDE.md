# Coding Style

Our JavaScript code follows the [airbnb style](https://github.com/airbnb/javascript)
with a [few exceptions](../../blob/master/.eslintrc). The precise rules are likely to
change a little as we get started so for now let eslint be your guide.

## Importing modules

Always use the ES6 module syntax for [importing modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
and [exporting from modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export).
While Node and Electron don't support this natively at the moment we expect them to in
the future. Babel will transpile this down to the commonjs syntax for now.

## Asynchronous code

Prefer promise style APIs and functions when writing or using asynchronous code. Also
prefer to use [ES7 async functions](http://www.sitepoint.com/simplifying-asynchronous-coding-es7-async-functions/)
which protect you from various mistakes that lead to not calling resolve/reject on
your promise.

# Importing new NPM modules

We won't add new NPM dependencies to the runtime lightly. There must be a proven need
that cannot easily be met without the module and its code quality, API style and size
will be taken into account when judging that. The same applies though to a lesser
extent to modules that are only needed for develop/build/package activies.
