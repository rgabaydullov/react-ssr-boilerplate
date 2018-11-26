const path = require('path');

const config = require('./config/webpack').default;
const domains = require('./config/domains.json');

const mode = process.env.NODE_ENV && process.env.NODE_ENV !== 'development'
  ? 'production'
  : 'development';
const ENVIRONMENT = domains[mode];

module.exports = config({
  target: 'web',
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
  entry: {
    app: (mode === 'development'
      ? [`webpack-hot-middleware/client?path=http://${ENVIRONMENT[0]}/__webpack_hmr`, './dev/src/index.jsx']
      : ['./dev/src/index.jsx']),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    chunkFilename: '[name].js',
    filename: '[name].js',
    publicPath: '/',
  },
});
