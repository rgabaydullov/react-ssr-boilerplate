const path = require('path');
const webpack = require('webpack');

// Webpack plugins
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const config = require('./config/domains.json');

const mode = process.env.NODE_ENV && process.env.NODE_ENV !== 'development' ? 'production' : 'development';
const ENVIRONMENT = config[mode];

const watch = mode === 'development';
const entry = { app: ['./dev/src/index.jsx'] };
if (mode === 'development') {
  entry.app.unshift(`webpack-hot-middleware/client?path=http://${ENVIRONMENT[0]}/__webpack_hmr`);
}
const scssLoader = mode === 'development'
  ? ['style-loader', 'css-loader?sourceMap', 'resolve-url-loader', 'sass-loader?sourceMap']
  : [MiniCssExtractPlugin.loader, 'css-loader', 'resolve-url-loader', 'sass-loader'];
const cssLoader = mode === 'development'
  ? ['style-loader', 'css-loader']
  : [MiniCssExtractPlugin.loader, 'css-loader'];
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
    new OptimizeCssAssetsPlugin({}),
  ];

module.exports = {
  mode,
  watch,
  optimization: {
    splitChunks: {
      cacheGroups: {
        manifest: {
          name: 'manifest',
          minChunks: Infinity,
        },
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendor',
          chunks: 'all',
        },
        styles: {
          test: /\.(sc|c).ss$/,
          name: 'styles',
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
  entry,
  output: {
    path: path.join(__dirname, 'dist'),
    chunkFilename: '[name].js',
    filename: '[name].js',
    publicPath: '/',
  },
  devtool: 'source-map',
  resolve: {
    modules: ['node_modules', 'dev/src'],
    extensions: ['.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
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
        test: /\.css$/,
        use: cssLoader,
      },
      {
        test: /\.(jpg|jpeg|png|svg|gif|eot|ttf|woff|)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'assets/[name].[ext]?[hash:8]',
          },
        }],
      },
      {
        test: /\.yml$/,
        use: ['json-loader', 'yaml-loader'],
      },
    ],
  },
  plugins,
};
