
import lint from 'mocha-eslint';

const paths = ['./shared', './app', './ui'];

const options = {
  alwaysWarn: false,
  timeout: 10000,
};

lint(paths, options);
