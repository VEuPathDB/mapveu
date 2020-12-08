const path = require('path');
module.exports = {
  stories: ['../src/**/*.stories.js', '../src/**/*.stories.tsx'],
  addons: [
    '@storybook/preset-typescript',
    '@storybook/addon-actions',
    '@storybook/addon-links',
    '@storybook/addon-knobs',
  ],
  // Fix to allow loading external dependency as typescript. This is temporary
  // and will be removed when this dependency is replaces with an npm package.
  webpackFinal: async (config) => {
    const newRule = { ...config.module.rules[0] };
    delete newRule.exclude;
    newRule.include = [path.resolve(__dirname, '../node_modules/visualization-tools')]
    config.module.rules.unshift(newRule);
    return config;
  }
};
