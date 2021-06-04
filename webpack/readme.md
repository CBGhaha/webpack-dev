## 一、准备阶段  
>### index.js 、NodeEnvironmentPlugin 、WebpackOptionsApply、SingleEntryPlugin
>  1. 创建Compiler实例
>  2. 使用 NodeEnvironmentPlugin 为Compiler创造读写文件的io能力
>  3. 遍历配置项的plugins 调用plugin的apply方法 挂载钩子
>  4. 使用 EntryOptionPlugin  遍历entry 为每一个entry入口创建一个SingleEntryPlugin实例  实例会在Compiler上注册自己的make钩子
>  5. 返回Compiler实例
>  6. 至此 webpack(config) 执行完毕 等待Compiler实例执行run方法进行编译


## 二、编译阶段
>  1. 执行run() => compile()
>  2. 创建了一个Compilation实例 执行compiler的make钩子。 上面SingleEntryPlugin注册的make钩子开始执行并调用compilation.addEntry() ，为compilation添加入口（一个入口就是一个chunk）
>  3. NormalModuleFactory.create() 工厂函数创建NormalModule实例，并且module及其子同步引入的module的name属性与入口名称保持一致。调用module.build（）开始编译
>  4. module.build 先读取文件内容 如果有loader用loader读取，如果没有使用fs读取。获取文件内容后会将内容解析成AST，替换require 和 import 为webpack的加载函数方法。
>  5. 在此处如果遇到的是同步引入 会将引入的模块加入当前的dependencies依赖列表，如果是异步引入会加入异步blocks列表。
>  6. 处理blocks列表: 异步引入的module的name会被再次定义为自己的name，作为一个新的入口被再次调用compilation.addEntry(block)。
>  7. 处理dependencies: 所有的子module都会递归执行build放法，被编译 并被添加进compilation的mdules列表。
> 
>  - 例如 A 同步引入B B异步引入C C又同步引入D 那么执行顺序会是
compilation.addEntry(A) A被添加入compilation的entries和modules , A.build() A代码被loader解析被AST转化编译  B被认为是A的dependencies 
B被加入modules B.build() B代码被loader解析被AST转化编译 C被认为是B的blocks 
C被重新定义name属性 compilation.addEntry(C)  C被添加入entries和modules  C.build() C代码被loader解析被AST转化编译  D被认为是C的dependencies 
D被加入modules D.build() D代码被loader解析被AST转化编译
D编译完成
C编译完成
B编译完成
A编译完成
compilation编译完成
至此 compilation上保存了本次编译的所有entries（chunks）和modules，并且chunks和modules可以通过name关联起来。因为每一个chunk的name都会成为其下引入的所有同步module的name

## 三. 输出阶段
> 1. 在 compile()中执行make钩子的时候 会设置执行seal的回调函数。当make执行完毕，开始seal。
> 2. 遍历compilation的entries,为每一个entry生成一个Chunk实例, 遍历modules找到每个chunk需要的的module，并赋值给chunk的modules属性
> 3. 为每个chunk这只文件名称 ，名称就为chunk的name属性。调用同步和异步模版将module里的代码，moduleId和webpack的运行代码组合起来生成js

## 四.其他
本demo未实现webpack的splitChunk和hash 单实现原理可以考虑在NormalModule类中生成blocks列表时 进行一些基于配置项的逻辑处理

