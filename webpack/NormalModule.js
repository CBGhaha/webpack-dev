class NormalModule {
  constructor(data) {
    const { name, context, rawRequest, resource, parser } = data;
    this.name = name;
    this.context = context;
    this.rawRequest = rawRequest;
    this.resource = resource;
    this.parser = parser; //AST解析器 ，可以把源代码转成AST抽象语法树
    this._source; // 此模块对应的源码
    this._ast; //此模块对应的ast抽象语法树
  }
  build(compilation, callback) {

  }
}
module.exports = NormalModule;