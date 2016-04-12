// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

'use strict';

module.exports = {
  async config(options) {
    await require('./task-config-builder')(options);
  },

  async build() {
    await this.config({ development: false });
    await require('./task-build')();
  },

  async buildDev() {
    await this.config({ development: true });
    await require('./task-build')();
  },

  async run() {
    await this.build();
    await require('./task-run')('production')();
  },

  async runDev() {
    await this.buildDev();
    await require('./task-run')('development')();
  },

  async clean() {
    await require('./task-clean-package')();
  },

  async package() {
    await this.clean();
    await this.build();
    await this.config({ development: false, packaged: true });
    await require('./task-package')();
  },
};
