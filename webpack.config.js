const path = require('path');
const webpack = require('webpack');

// Webpack plugins
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV && process.env.NODE_ENV !== 'development' ? 'production' : 'development';
console.log('MODE: %o', process.env.production);
const watch = mode === 'development';
const scssLoader = mode === 'development'
  ? ['style-loader', 'css-loader?sourceMap&module', 'sass-loader?sourceMap']
  : [MiniCssExtractPlugin.loader, 'css-loader?sourceMap&module', 'sass-loader?sourceMap'];
const plugins = mode === 'development'
  ? [
    new webpack.HotModuleReplacementPlugin(),
    new ReactLoadablePlugin({ filename: './server/react-loadable.json' }),
  ]
  : [
    new webpack.LoaderOptionsPlugin({
      debug: false,
    }),
    new ReactLoadablePlugin({ filename: './server/react-loadable.json' }),
    new MiniCssExtractPlugin({
      filename: 'styles.css',
      chunkFilename: '[id].css',
    }),
  ];

module.exports = {
  mode,
  watch,
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  entry: {
    app: [
      'webpack-hot-middleware/client?path=http://tony.local/__webpack_hmr',
      './dev/src/index.jsx',
    ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    chunkFilename: '[name].js',
    filename: '[name].js',
    publicPath: '/dist/',
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.js|\.jsx$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.scss$/,
        use: scssLoader,
      },
      {
        test: /\.yml$/,
        use: ['json-loader', 'yaml-loader'],
      },
    ],
  },
  plugins,
};
