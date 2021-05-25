/**
 * 挂载内置插件
 * 
 * 
*/
const EntryOptionPlugin  =  require('./EntryOptionPlugin');
class WebpackOptionsApply{
  constructor(){

  }
  process(options, compiler){
      // 注册插件
      new EntryOptionPlugin().apply(compiler);
      // 触发entryOption钩子
      compiler.hooks.entryOption.call(options.context, options.entry);
  }
}
module.exports = WebpackOptionsApply;