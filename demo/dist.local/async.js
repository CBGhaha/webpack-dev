// 将chunk的module通过webpackJsonpCallback添加到入口module列表
(window['webpackJsonp'] = window['webpackJsonp'] || []).push([['async'], {

  './src/async.js':
    (function(module, exports, __webpack_require__) {
      const name = __webpack_require__('./src/name.js');

      module.exports = name;
    }),

  './src/name.js':
    (function(module, exports, __webpack_require__) {
      module.exports = 'bangguo';
    })

}]);