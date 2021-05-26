const { Tapable, AsyncSeriesHook, SyncHook, AsyncParallelHook, SyncBailHook } = require('tapable');
const babylon = require('babylon');
class Parser extends Tapable {
  parse(source) {
    return babylon.parse(source, {
      sourceType: 'module', // 源代码是一个模块
      plugins: ['dynamicImport'] // 额外插件 支持import(./xxx.js)
    });
  }
}
module.exports = Parser;