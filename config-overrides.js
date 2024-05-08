const { override, addWebpackAlias } = require('customize-cra');
const path = require('path');

module.exports = override(
  // add an alias for "@" imports
  addWebpackAlias({
    '@': path.resolve(__dirname, 'src')
  })
);
