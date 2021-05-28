const path = require('path');
const types = require('babel-types');
const generate = require('babel-generator').default; // ast => ast
const traverse = require('babel-traverse').default; // 根据ast生成代码

class NormalModule {
  constructor(data) {
    const { name, context, rawRequest, moduleId, resource, parser } = data;
    this.name = name;
    this.context = context;
    this.rawRequest = rawRequest;
    this.resource = resource;
    this.moduleId = moduleId;
    this.parser = parser; //AST解析器 ，可以把源代码转成AST抽象语法树
    this._source; // 此模块对应的源码
    this._ast; //此模块对应的ast抽象语法树
    this.dependencies = [];
  }
  build(compilation, callback) {
    this.doBuild(compilation, (err)=>{
      // 生成ast
      this._ast = this.parser.parse(this._source);

      // 遍历语法树，找到里面的依赖，并收集依赖
      traverse(this._ast, {
        // 当遍历到CallExpression节点时，就会进入回调
        CallExpression: (nodePath)=>{
          let node = nodePath.node; // 获取节点
          if (node.callee.name === 'require') { // 如果方法名是一个require方法的话
            node.callee.name = '__webpack_require__'; // 将源码里的require函数变成__webpack_require__
            let moduleName = node.arguments[0].value; // 模块的名称
            // 判断moduleName是有文件名后缀
            // const extName = moduleName.split(path.posix.sep).pop().indexof('.') === -1;
            let depResource = path.posix.join(path.posix.dirname(this.resource), moduleName);// 模块的绝对地址
            let depModuleId = './' + path.posix.relative(this.context, depResource); // 模块的id

            /**
             * 将源码里的相对当前文件的地址变成相对执行目录的地址
             * ./title.js => ./deme/src/title.js
             */
            node.arguments = [types.stringLiteral(depModuleId)];


            this.dependencies.push({
              name: this.name,
              context: this.context,
              rawRequest: moduleName,
              moduleId: depModuleId,
              resource: depResource
            });
          }

        }
      });
      let { code } = generate(this._ast);
      this._source = code;
      callback(err);

    });
  }
  /**
   * 1.读取模块的源代码
   * @param {*} compilation
   * @param {*} cb
   */
  doBuild(compilation, cb) {
    this.getSource(compilation, (err, source)=>{
      // 把最原始的代码存放到_source
      // loader在此处执行
      this._source = source;
      cb(err);
    });
  }
  /**
   * 读取真正的源代码
   */
  getSource(compilation, callback) {
    compilation.inputFileSystem.readFile(this.resource, 'utf-8', callback);
  }
}
module.exports = NormalModule;
/**
 * 1.将硬盘上的模块读出成为一个文本
 * 2.可能它不是一个js模块,所以会走babel的转换， 最终要得到一个js模块
 * 3.把js模块代码经过parser处理转换成抽象语法树 AST
 * 4.分析AST里面的依赖，也就是找require import节点
 * 5.递归编译依赖的模块
 * 6.不停的依次递归上面的5步知道所有的模块编译完成
 */
/**
 * 模块id的问题
 * 不管是相对的本地模块，还是第三方模块
 * 最后它的moduleID全都是一个相对于项目根目录的相对路径
 */