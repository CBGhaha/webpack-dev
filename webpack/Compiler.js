 const { Tapable, AsyncSeriesHook } = require('tapable');
class Compiler extends Tapable{
  constructor(context){
    super();
    this.context = context;
    this.hooks = {
      done: new AsyncSeriesHook(['stats'])
    }
  }
  run(callback){
    console.log("conpiler run");
    callback(null, {
      toJSON(){
        return {
          entries: true, // 显示所有入口
          chunks: true, // 显示所有代码块
          module: true, // 显示所有模块
          assets: true //显示所有打包好的文件
        }
      }
    })
  }
}
exports.default = Compilergit