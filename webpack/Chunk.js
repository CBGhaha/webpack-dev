class Chunk {
  constructor(entryModule) {
    this.entryModule = entryModule;
    this.name = entryModule.name;
    this.files = []; // 这个代码块生成的文件
    this.modules = [];// chunk包含的模块
  }

}
module.exports = Chunk;