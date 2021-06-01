// const webpack = require('webpack');
const webpack = require('../webpack/index');
const webpackOptions = require('./webpack.config.js');
// debugger;
const compiler = webpack(webpackOptions);
compiler.run((err, stats) => {
  console.log(
    stats.toJson({
      entries: true, // 显示所有入口
      chunks: true, // 显示所有代码块
      modules: true, // 显示所有模块
      assets: true //显示所有打包好的文件
    })
  );
});