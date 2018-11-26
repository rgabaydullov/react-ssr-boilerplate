const path = require('path');
const config = require('../config/webpack').default;

module.exports = config({
  target: 'node',
  entry: {
    app: [
      path.resolve(__dirname, 'index.js'),
    ],
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'server.js',
  },
}, 'server');
