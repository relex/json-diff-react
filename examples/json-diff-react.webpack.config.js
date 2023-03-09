const webpack = require('webpack');
const path = require('path');

// A simple bundle of “json-diff-react” library to use for examples.
// Rebuild it like this (from the project root):
//   npx webpack --config examples/json-diff-react.webpack.config.js
module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, '..', 'lib', 'index.js'),
  output: {
    path: path.resolve(__dirname),
    filename: 'json-diff-react.bundle.js',
    library: 'json-diff-react',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  resolve: {
    fallback: { "assert": false },
  },
};
