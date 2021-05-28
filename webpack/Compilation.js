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
    this._addModuleChain(context, entry, name, (err, module) => {
      callback(err, module);
    });
  }
  _addModuleChain(context, entry, name, callback) {
    const resource = path.posix.join(context, entry);
    // 通过模块工厂创建一个模块
    let entryModule = normalModuleFactory.create({
      name,
      context,
      rawRequest: entry,
      resource, // 模块的绝对路径
      parser,
      moduleId: './' + path.posix.relative(context, resource)
    });
    this.entries.push(entryModule);
    this.buildModule(entryModule, callback);
  }
  // 编译模块
  buildModule(module, callback) {
    this.modules.push(module);
    const afterBuild = (err, afterBuildModule)=>{
      // 编译当前模块的依赖
      if (afterBuildModule.dependencies.length) {
        this.processModuleDependencies(afterBuildModule, (err)=>{
          callback(err, afterBuildModule);
        });
      } else {
        callback(err, afterBuildModule);
      }
    };
    // 模块的真正的编译逻辑是在module的内部完成
    module.build(this, (err)=>{
      // 走到这意味着一个模块编译完成了
      this.hooks.succeedModule.call(module);
      afterBuild(err, module);
    });
  }
  // 编译模块依赖
  processModuleDependencies(module, callback) {
    const { dependencies } = module;
    const dependenciesBuildTask = dependencies.map(dependency => {
      const { name, context, rawRequest, moduleId, resource } = dependency;
      const dependencyModule = normalModuleFactory.create({
        name, context, rawRequest, moduleId, resource, parser
      });
      return new Promise((resolve, reject)=>{
        this.buildModule(dependencyModule, (err, afterBuildModule)=>{
          if (err) {
            reject(err);
          } else {
            resolve(afterBuildModule);
          }
        });
      });
    });
    Promise.all(dependenciesBuildTask).then(res=>{
      callback(null, module);
    });
  }
  /**
   *把模块封装成chunk
   * @param {*} callback
   */
  seal(callback) {

  }
}
module.exports = Compilation;