const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: ['./src/main.tsx'],
  module: {
    rules: require('./webpack.rules'),
  },
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].chunk.js',
    clean: true,
    publicPath: process.env.PUBLIC_URL || '',
    // apiPath: 'https://localhost:8083',
    // websocketPath: 'wss://localhost:8083',
  },
  plugins: [
    ...require('./webpack.plugins'),
    new webpack.DefinePlugin({
      'process.env.API_URL': JSON.stringify('https://production-server.com'),
      'process.env.WEBSOCKET_URL': JSON.stringify(
        'wss://production-server.com',
      ),
    }),
  ],
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss'],
    alias: {
      // Custom Aliases
      ...require('./webpack.aliases'),
    },
  },
  stats: 'errors-warnings',
  optimization: {
    minimize: true,
    sideEffects: true,
    concatenateModules: true,
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 10,
      minSize: 0,
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
        },
      },
    },
  },
};
