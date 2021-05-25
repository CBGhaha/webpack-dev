 const { Tapable, AsyncSeriesHook, AsyncParallelHook, SyncBailHook } = require('tapable');
class Compiler extends Tapable{
  constructor(context){
    super();
    this.context = context;
    this.hooks = {
      done: new AsyncSeriesHook(['stats']),
      entryOption: new SyncBailHook('context', 'entry'),
      mack: new AsyncParallelHook(['compilation']),
    }
  }
  run(callback){
    console.log("conpiler run");
    callback(null, {
      toJSON(){
        return {
          entries: [], // 显示所有入口
          chunks: [], // 显示所有代码块
          modules: [], // 显示所有模块
          assets: [] //显示所有打包好的文件
        }
      }
    })
  }
}
exports.default = Compilergit