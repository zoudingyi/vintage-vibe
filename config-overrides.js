const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

const srcPath = path.resolve(__dirname, 'src');

module.exports = {
  webpack: override(
    // add an alias for "@" imports
    addWebpackAlias({
      '@': srcPath
    })
  ),
  jest: config => {
    config.moduleNameMapper = {
      ...config.moduleNameMapper,
      '^@/(.*)$': '<rootDir>/src/$1'
    };
    return config;
  }
};
