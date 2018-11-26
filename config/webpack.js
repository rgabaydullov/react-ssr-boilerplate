const webpack = require('webpack');
const webpackNodeExternals = require('webpack-node-externals');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const customSassLoader = require('../dev/src/utils/customSassLoader');

const DEVELOPMENT = 'development';
const PRODUCTION = 'production';

// All absolute path are from the root!

export default function config({
  target,
  optimization = {},
  entry,
  output,
  devtool = 'eval',
}, envType = 'client') {
  const mode = process.env.NODE_ENV && process.env.NODE_ENV !== DEVELOPMENT
    ? PRODUCTION
    : DEVELOPMENT;
  let watch = mode === DEVELOPMENT;
  const scss2cssLoader = {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      sourceMap: true,
    },
  };
  const resolveUrlLoader = {
    loader: 'resolve-url-loader',
    options: {
      keepQuery: true,
    },
  };
  let scssLoader = [scss2cssLoader];
  const cssLoader = ['css-loader'];
  const externals = [];
  let plugins = [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.DOMAIN': JSON.stringify(process.env.DOMAIN || ''),
    }),
  ];

  // Fulfill the pattern in order of envType
  if (envType === 'client') {
    scssLoader.unshift(mode === DEVELOPMENT
      ? 'style-loader'
      : MiniCssExtractPlugin.loader);

    cssLoader.unshift(mode === DEVELOPMENT
      ? 'style-loader'
      : MiniCssExtractPlugin.loader);

    plugins = plugins.concat(mode === DEVELOPMENT
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
      ]);
  } else {
    externals.push(webpackNodeExternals());

    plugins = plugins.concat([
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ]);
  }

  scssLoader = scssLoader.concat([
    resolveUrlLoader,
    customSassLoader,
  ]);

  /* eslint no-param-reassign: [0, "devtool"] */
  if (mode === DEVELOPMENT) {
    watch = envType === 'client'
      ? watch
      : false;

    devtool = envType === 'client'
      ? devtool
      : false;
  } else {
    watch = false;

    devtool = false;
  }

  return {
    mode,
    watch,
    target,
    optimization,
    entry,
    output,
    devtool,
    resolve: {
      // modules: ['node_modules', 'dev/src'],
      extensions: ['.js', '.jsx'],
      // alias: {
      //   react: 'preact-compat',
      //   'react-dom': 'preact-compat',
      // },
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: ['babel-loader', 'eslint-loader'],
          exclude: /node_modules/,
        },
        {
          test: /\.html$/,
          loader: 'html-loader',
        },
        {
          test: /\.svg(\?.*)?$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: 'assets/[name].[ext]?[hash:8]',
              },
            },
            'svg-transform-loader',
          ],
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
          test: /\.(jpg|jpeg|png|gif|eot|ttf|woff|pdf)$/,
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
    externals,
    plugins,
  };
}
