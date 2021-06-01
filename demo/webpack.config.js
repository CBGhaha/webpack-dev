const path = require('path');

module.exports = {
  context: path.resolve(__dirname), //当前的工作目录
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    chunkFilename: '[name].js'
  }
};