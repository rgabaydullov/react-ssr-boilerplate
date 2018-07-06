const path = require('path');
const webpack = require('webpack');
const webpackNodeExternals = require('webpack-node-externals');

const mode = process.env.NODE_ENV && process.env.NODE_ENV !== 'development' ? 'production' : 'development';

module.exports = {
  mode,
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
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: ['css-loader', 'sass-loader'],
      },
    ],
  },
  externals: [webpackNodeExternals()],
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
};
