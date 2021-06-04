// const Tapable = require('tapable');
// const { AsyncSeriesHook, SyncHook, AsyncParallelHook, SyncBailHook } = Tapable;
const { Tapable, AsyncSeriesHook, SyncHook, AsyncParallelHook, SyncBailHook } = require('tapable');
const Compilation = require('./Compilation');
const NormalModuleFactory = require('./NormalModuleFactory');
const Stats = require('./Stats');
const mkdirp = require('mkdirp');
const path = require('path');

/**
 * Tapable有plugin方法 会找寻this.hooks 并在对应钩子中挂载回调
 */
class Compiler extends Tapable {
  constructor(options) {
    super();
    this.options = options;
    this.context = options.context;
    this.hooks = {
      entryOption: new SyncBailHook(['context', 'entry']),
      beforeRun: new AsyncSeriesHook(['compiler']), // 运行前
      run: new AsyncSeriesHook(['compiler']), // 运行
      beforeCompile: new AsyncSeriesHook(['params']), // 编译前
      compile: new SyncHook(['params']), // 编译
      make: new AsyncParallelHook(['compilation']), // make构建
      thisCompilation: new SyncHook(['compilation', 'params']), // 开始一次新的编译
      compilation: new SyncHook(['compilation', 'params']), // 创建完成一个新的compilation
      afterCompile: new AsyncSeriesHook(['compilation']), // 编译完成
      emit: new AsyncSeriesHook(['compilation']), // 写入文件
      done: new AsyncSeriesHook(['stats'])
    };
  }
  run(callback) {
    console.log('compiler run');
    const finalCallback = (err, stats) => {
      callback(err, stats);
    };
    const onCompiled = (err, compilation) => {
      console.log('onCompiled');
      // 把chunk变成文件 写入硬盘

      this.emitAssets(compilation, (err)=>{
        let stats = new Stats(compilation);
        this.hooks.done.callAsync(stats, err=>{
          finalCallback(err, stats);
        });
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

        // 开始代码块封装
        compilation.seal(err=>{
          this.hooks.afterCompile.callAsync(compilation, ()=>{
            callback(err, compilation);
          });
        });

      });
    });
  }
  emitAssets(compilation, callback) {
    const emitFiles = (err)=>{
      const assets = compilation.assets;
      const outputPath = this.options.output.path;
      for (let file in assets) {
        let source = assets[file];
        const targetPath = path.posix.join(outputPath, file);
        this.outputFileSystem.writeFileSync(targetPath, source, 'utf8');
      }
      callback();
    };
    this.hooks.emit.callAsync(compilation, ()=>{
      mkdirp(this.options.output.path, emitFiles);
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