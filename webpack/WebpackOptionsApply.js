/**
 * 挂载内置插件
 *
 *
*/
const EntryOptionPlugin = require('./EntryOptionPlugin');
class WebpackOptionsApply {
  constructor() {

  }
  process(options, compiler) {
    // 注册插件
    new EntryOptionPlugin().apply(compiler);
    // 触发entryOption钩子
    const { context, entry } = options;
    compiler.hooks.entryOption.call(context, entry);

  }
}
module.exports = WebpackOptionsApply;