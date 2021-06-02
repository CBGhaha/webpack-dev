const { Tapable, AsyncSeriesHook, SyncHook, AsyncParallelHook, SyncBailHook } = require('tapable');
const path = require('path');
const Parser = require('./parser');
const parser = new Parser();
const NormalModuleFactory = require('./NormalModuleFactory');
const Chunk = require('./Chunk');
const ejs = require('ejs');
const fs = require('fs');

const mainTemplate = fs.readFileSync(path.join(__dirname, 'templatce/main.ejs'), 'utf8');
const mainRender = ejs.compile(mainTemplate);

const chunkTemplate = fs.readFileSync(path.join(__dirname, 'templatce/chunk.ejs'), 'utf8');
const chunkRender = ejs.compile(chunkTemplate);

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
    this.chunks = []; // 代码块数组
    this.files = [];// 本地编译所有产出的文件名
    this.assets = {}; // 存放生成的资源 key是文件名 值是文件内容
    this.hooks = {
      // 当成功构建完一个模块后 就会触发此钩子执行
      succeedModule: new SyncHook(['module']),
      seal: new SyncHook(),
      beforeChunks: new SyncHook(),
      afterChunks: new SyncHook()
    };
  }
  /**
   * 开始编译一个新的入口
   */
  addEntry(context, entry, name, callback) {
    this._addModuleChain(context, entry, name, false, (err, module) => {
      callback(err, module);
    });
  }
  _addModuleChain(context, entry, name, async, callback) {
    const resource = path.posix.join(context, entry);
    // 通过模块工厂创建一个模块
    let entryModule = normalModuleFactory.create({
      name,
      context,
      rawRequest: entry,
      resource, // 模块的绝对路径
      parser,
      async,
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
    console.log('开始seal');
    this.hooks.seal.call();
    this.hooks.beforeChunks.call();
    for (const entryModule of this.entries) {
      const chunk = new Chunk(entryModule);
      this.chunks.push(chunk);
      chunk.modules = this.modules.filter(module=>module.name === chunk.name);
    }
    this.hooks.afterChunks.call(this.chunks);
    this.createChunkAsset();
    callback();
  }
  createChunkAsset() {
    for (let chunk of this.chunks) {
      const file = chunk.name + '.js';
      chunk.files.push(file);
      let source;
      // 如果是异步的chunk
      if (chunk.async) {
        source = chunkRender({
          chunkName: chunk.name,
          modules: chunk.modules
        });
      //
      } else {
        source = mainRender({
          entryModuleId: chunk.entryModule.moduleId,
          modules: chunk.modules
        });
      }
      // console.log('chunk.modules:', chunk.modules);

      this.emitAssets(file, source);
    }
  }
  emitAssets(file, source) {
    this.assets[file] = source;
    this.files.push(file);
  }
}
module.exports = Compilation;