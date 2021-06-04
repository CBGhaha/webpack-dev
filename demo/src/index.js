
const title = require('./title.js');
const style = require('./index.less');
console.log('title:', title);

import(/* webpackChunkName: "async" */'./async.js').then(res=>{
  console.log("async:", res.default);
})
import(/* webpackChunkName: "async2" */'./async2.js').then(res=>{
  console.log("async2:", res.default);
})
// const isarrayc = require('isarray');