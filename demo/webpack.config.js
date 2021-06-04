const path = require('path');

module.exports = {
  context: path.resolve(__dirname), //当前的工作目录
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    chunkFilename: '[name].js'
  },
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all', //将什么类型的代码块用于分割，三选一： "initial"：入口代码块 | "all"：全部 | "async"：按需加载的代码块
  //     minSize: 0, //大小超过30kb的模块才会被提取
  //     minChunks: 1, //某个模块至少被多少代码块引用，才会被提取成新的chunk
  //     maxAsyncRequests: 5, //分割后，按需加载的代码块最多允许的并行请求数，在webpack5里默认值变为6
  //     maxInitialRequests: 3, //分割后，入口代码块最多允许的并行请求数，在webpack5里默认值变为4
  //     automaticNameDelimiter: '~', //代码块命名分割符
  //     cacheGroups: {
  //       async: {
  //         chunks: 'async',
  //         minSize: 0,
  //         name: true,
  //         priority: 2
  //       },
  //       default: {
  //         chunks: 'all',
  //         minSize: 0,
  //         name: true,
  //         priority: 1
  //       }
  //     }

  //   },
  //   runtimeChunk: {
  //     name: 'manifest'
  //   }
  // }
  resolveLoader: {
    modules: '../loader'
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'less-loader'

        ]
      }
    ]
  }
};