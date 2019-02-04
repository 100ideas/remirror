const defaultConfig = require('../../support/babel/base.babel');

module.exports = {
  ...defaultConfig,
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false,
        targets: {
          node: '8',
        },
      },
    ],
  ],
  plugins: [...defaultConfig.plugins],
};