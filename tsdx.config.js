var banner2 = require('rollup-plugin-banner2');

// Not transpiled with TypeScript or Babel, so use plain Es6/Node.js!
module.exports = {
  // This function will run for each entry/format/env combination
  rollup(config, _options) {
    config.plugins.push(
      banner2(() => {
        return '"use client"; \n';
      })
    );

    return config; // always return a config.
  },
};
