(function(modules) {
  function webpackJsonpCallback(data) {
    var chunkIds = data[0];
    var moreModules = data[1];
    var executeModules = data[2];

    var moduleId, chunkId, i = 0, resolves = [];
    for (;i < chunkIds.length; i++) {
      chunkId = chunkIds[i];
      if (Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
        resolves.push(installedChunks[chunkId][0]);
      }
      installedChunks[chunkId] = 0; // 记录当前的chunk是已经记载过的
    }
    // 将chunk里的module加入到modules列表
    for (moduleId in moreModules) {
      if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
        modules[moduleId] = moreModules[moduleId];
      }
    }
    if (parentJsonpFunction) parentJsonpFunction(data);

    while (resolves.length) {
      resolves.shift()();
    }

    deferredModules.push.apply(deferredModules, executeModules || []);

    return checkDeferredModules(); // 每次有chunk加载完毕 都会检查一次异步列表
  }
  function checkDeferredModules() {
    var result;
    // 遍历检查异步加载模块列表是否全部加载完成
    for (var i = 0; i < deferredModules.length; i++) {
      var deferredModule = deferredModules[i];
      var fulfilled = true;
      for (var j = 1; j < deferredModule.length; j++) {
        var depId = deferredModule[j];
        if (installedChunks[depId] !== 0) fulfilled = false;
      }
      if (fulfilled) {
        deferredModules.splice(i--, 1);
        result = __webpack_require__(__webpack_require__.s = deferredModule[0]); // 加载完成后同步加载第一个module
      }
    }

    return result;
  }

  var installedModules = {}; // 模块缓存组
  var installedChunks = { // chunk缓存组
    'manifest': 0
  };

  var deferredModules = []; // 需要加载完成才能执行的异步模块列表（例如项目入口main需要./src/index.js manifest default~main 三个模块 ，当三个都加载好了的时候 开始执行./src/index.js）

  function jsonpScriptSrc(chunkId) {
    return __webpack_require__.p + '' + ({ 'async~async~async2': 'async~async~async2', 'async~async': 'async~async', 'async~async2': 'async~async2' }[chunkId] || chunkId) + '.js';
  }
  // 同步引入的方法
  function __webpack_require__(moduleId) {

    if (installedModules[moduleId]) {
      return installedModules[moduleId].exports;
    }
    var module = installedModules[moduleId] = {
      i: moduleId,
      l: false,
      exports: {}
    };

    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    module.l = true;

    return module.exports;
  }
  // 异步引入的方法
  __webpack_require__.e = function requireEnsure(chunkId) {
    var promises = [];

    var installedChunkData = installedChunks[chunkId];// 判读该chunk是否已经加载过 !==0
    if (installedChunkData !== 0) {
      if (installedChunkData) { // 如果这个chunk正在加载
        promises.push(installedChunkData[2]); // 返回上次的promise
      } else {
        // setup Promise in chunk cache 新建一个加载chunk的promise
        var promise = new Promise(function(resolve, reject) {
          installedChunkData = installedChunks[chunkId] = [resolve, reject]; // 在installedChunkData中记录这个chunk在加载中的状态
        });
        promises.push(installedChunkData[2] = promise);

        // start chunk loading
        var script = document.createElement('script');
        var onScriptComplete;

        script.charset = 'utf-8';
        script.timeout = 120;
        if (__webpack_require__.nc) {
          script.setAttribute('nonce', __webpack_require__.nc);
        }
        script.src = jsonpScriptSrc(chunkId);
        var error = new Error();
        onScriptComplete = function (event) {
          script.onerror = script.onload = null;
          clearTimeout(timeout);
          var chunk = installedChunks[chunkId];
          // 如果chunk加载失败
          if (chunk !== 0) {
            if (chunk) {
              var errorType = event && (event.type === 'load' ? 'missing' : event.type);
              var realSrc = event && event.target && event.target.src;
              error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
              error.name = 'ChunkLoadError';
              error.type = errorType;
              error.request = realSrc;
              chunk[1](error);
            }
            installedChunks[chunkId] = undefined;
          }
        };
        var timeout = setTimeout(function() {
          onScriptComplete({ type: 'timeout', target: script });
        }, 120000);
        script.onerror = script.onload = onScriptComplete;
        document.head.appendChild(script);
      }
    }
    return Promise.all(promises); // 返回一个promise 该promise会在chunk加载完成 执行webpackJsonpCallback的时候变成resolve状态
  };

  // expose the modules object (__webpack_modules__)
  __webpack_require__.m = modules;

  // expose the module cache
  __webpack_require__.c = installedModules;

  // define getter function for harmony exports
  __webpack_require__.d = function(exports, name, getter) {
    if (!__webpack_require__.o(exports, name)) {
      Object.defineProperty(exports, name, { enumerable: true, get: getter });
    }
  };

  // define __esModule on exports
  __webpack_require__.r = function(exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
  };

  __webpack_require__.t = function(value, mode) {
    if (mode & 1) value = __webpack_require__(value);
    if (mode & 8) return value;
    if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
    var ns = Object.create(null);
    __webpack_require__.r(ns);
    Object.defineProperty(ns, 'default', { enumerable: true, value: value });
    if (mode & 2 && typeof value !== 'string') for (var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
    return ns;
  };

  __webpack_require__.n = function(module) {
    var getter = module && module.__esModule ?
      function getDefault() { return module['default']; } :
      function getModuleExports() { return module; };
    __webpack_require__.d(getter, 'a', getter);
    return getter;
  };

  __webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
  __webpack_require__.p = '';

  __webpack_require__.oe = function(err) { console.error(err); throw err; };

  var jsonpArray = window['webpackJsonp'] = window['webpackJsonp'] || [];// 获取缓存里未处理的chunk module（如果default~main先加载并执行 那么其中的模块已经挂载到window['webpackJsonp']，但没webpackJsonpCallback）
  var oldJsonpFunction = jsonpArray.push.bind(jsonpArray); // 数组原本的push
  jsonpArray.push = webpackJsonpCallback; // 被改写的push
  jsonpArray = jsonpArray.slice();
  for (var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]); // 将chunk module加入modules
  var parentJsonpFunction = oldJsonpFunction;

  checkDeferredModules(); //检查异步记载的模块
})([]);