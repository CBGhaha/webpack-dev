const Compiler = require('./Compiler');
const NodeEnvironmentPlugin = require('./node/NodeEnvironmentPlugin');
const WebpackOptionsApply  =  require('./WebpackOptionsApply');
const webpack  = (options, callback) => {
  let compiler  = new Compiler(options.context); // 创建一个compiler实例
  compiler.options = options;
  new NodeEnvironmentPlugin().apply(compiler); // 让compiler实例拥有读写文件的权限
  // 挂载配置文件里所有的plugins
  if(options.plugins&&Array.isArray(options.plugins)){
    for (const plugin of options.plugins){
      plugin.apply(compiler);
    }
  }
  new WebpackOptionsApply().process(options, compiler);
  return compiler;
}

exports = module.exports = webpack