(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["default~main"],{

/***/ "../node_modules/isarray/index.js":
/*!****************************************!*\
  !*** ../node_modules/isarray/index.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


const title = __webpack_require__(/*! ./title.js */ "./src/title.js");
console.log('title:', title);

Promise.all(/*! import() | async */[__webpack_require__.e("async~async~async2"), __webpack_require__.e("async~async")]).then(__webpack_require__.t.bind(null, /*! ./async.js */ "./src/async.js", 7)).then(res=>{
  console.log("async:", res.default);
})
Promise.all(/*! import() | async2 */[__webpack_require__.e("async~async~async2"), __webpack_require__.e("async~async2")]).then(__webpack_require__.t.bind(null, /*! ./async2.js */ "./src/async2.js", 7)).then(res=>{
  console.log("async2:", res.default);
})
const isarrayc = __webpack_require__(/*! isarray */ "../node_modules/isarray/index.js");

/***/ }),

/***/ "./src/title.js":
/*!**********************!*\
  !*** ./src/title.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = 'title';

/***/ })

}]);