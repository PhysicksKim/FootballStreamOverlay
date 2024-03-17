const fs = require('fs');
const path = require('path');

module.exports = {
  mode: 'development',
  entry: ['./src/main.tsx'],
  module: {
    rules: require('./webpack.rules'),
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].chunk.js',
  },
  plugins: require('./webpack.plugins'),
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.scss'],
    alias: require('./webpack.aliases'),
  },
  stats: 'errors-warnings',
  devtool: 'cheap-module-source-map',
  devServer: {
    open: true,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, '../../localhost-key.pem')), // 개인 키 경로
      cert: fs.readFileSync(path.resolve(__dirname, '../../localhost.pem')), // 인증서 경로
      // key: fs.readFileSync(path.join(__dirname, 'localhost-key.pem')), // 개인 키 경로
      // cert: fs.readFileSync(path.join(__dirname, 'localhost.pem')), // 인증서 경로
    },
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    hints: false,
  },
};
