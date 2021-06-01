import(/* webpackChunkName: "async" */'./async.js').then(res=>{
  console.log("async:", res.default);
})
const title = require('./title.js');
console.log('title:', title);
const isarrayc = require('isarray');