// const Tapable = require('tapable');
// const { AsyncSeriesHook, SyncHook, AsyncParallelHook, SyncBailHook } = Tapable;
const { Tapable, AsyncSeriesHook, SyncHook, AsyncParallelHook, SyncBailHook } = require('tapable');
const Compilation = require('./Compilation');
const NormalModuleFactory = require('./NormalModuleFactory');
class Compiler extends Tapable {
  constructor(context) {
    super();
    this.context = context;
    this.hooks = {
      done: new AsyncSeriesHook(['stats']),
      entryOption: new SyncBailHook('context', 'entry'),
      beforeRun: new AsyncSeriesHook(['compiler']), // 运行前
      run: new AsyncSeriesHook(['compiler']), // 运行
      beforeCompile: new AsyncSeriesHook(['params']), // 编译前
      compile: new SyncHook(['params']), // 编译
      make: new AsyncParallelHook(['compilation']), // make构建
      thisCompilation: new SyncHook(['compilation', 'params']), // 开始一次新的编译
      compilation: new SyncHook(['compilation', 'params']), // 创建完成一个新的compilation
      afterCompile: new AsyncSeriesHook(['compilation']) // 编译完成
    };
  }
  run(callback) {
    console.log('compiler run');
    const finalCallback = (err, stats) => {
      callback(err, stats);
    };
    const onCompiled = (err, compilation) => {
      console.log('onCompiled');
      finalCallback(err, {
        entries: [], // 显示所有入口
        chunks: [], // 显示所有代码块
        modules: [], // 显示所有模块
        assets: [] //显示所有打包好的文件
      });
    };
    this.hooks.beforeRun.callAsync(this, err=>{
      this.hooks.run.callAsync(this, err=>{
        this.compile(onCompiled);
      });
    });
  }
  compile(callback) {
    const params = this.newCompilationParams();
    this.hooks.beforeCompile.callAsync(params, err=>{
      this.hooks.compile.call(params);
      const compilation = this.newCompilation(params);
      console.log('make');
      this.hooks.make.callAsync(compilation, err=>{
        console.log('make完成');
        callback();
      });
    });
  }
  newCompilationParams() {
    const params = {
      // 在创建compilation之前 已经创建了一个普通模块工厂
      normalModuleFactory: new NormalModuleFactory()
    };
    return params;
  }
  newCompilation(params) {
    const compilation = this.createCompilation(params);
    this.hooks.thisCompilation.call(compilation, params);
    this.hooks.compilation.call(compilation, params);
    return compilation;
  }
  createCompilation() {
    return new Compilation(this);
  }

}
module.exports = Compiler;