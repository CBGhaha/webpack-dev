const { Tapable, AsyncSeriesHook, SyncHook, AsyncParallelHook, SyncBailHook } = require('tapable');
const path = require('path');
const Parser = require('./parser');
const parser = new Parser();
const NormalModuleFactory = require('./NormalModuleFactory');
const normalModuleFactory = new NormalModuleFactory();
class Compilation extends Tapable {
  constructor(compiler) {
    super();
    this.compiler = compiler;
    this.options = compiler.options;
    this.context = compiler.context;
    this.inputFileSystem = compiler.inputFileSystem;
    this.outputFileSystem = compiler.outputFileSystem;
    this.entries = []; // 入口的数组
    this.modules = []; // 模块的数组
    this.hooks = {
      // 当成功构建完一个模块后 就会触发此钩子执行
      succeedModule: new SyncHook(['module'])
    };
  }
  /**
   * 开始编译一个新的入口
   */
  addEntry(context, entry, name, callback) {
    this._addModuleChain(context, entry, name, (err, module)=>{
      callback(err, module);
    });
  }
  _addModuleChain(context, entry, name, callback) {
    // 通过模块工厂创建一个模块
    let entryModule = normalModuleFactory.create({
      name,
      context,
      rawRequest: entry,
      resource: path.posix.join(context, entry),
      parser
    });
    this.entries.push(entryModule);
    this.modules.push(entryModule);
    const afterBuild = (err)=>{
      return callback(err, entryModule);
    };
    this.buildModule(entryModule, afterBuild);
  }
  // 编译模块
  buildModule(module, afterBuild) {
    // 模块的真正的编译逻辑是在module的内部完成
    module.build(this, (err)=>{
      // 走到这意味着一个模块编译完成了
      this.hooks.succeedModule.call(module);
      afterBuild(err);
    });
  }
}
module.exports = Compilation;