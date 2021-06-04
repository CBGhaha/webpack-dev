module.exports = function(source) {
  let str = `let style = document.createElement('style');
    style.innerHTML = ${JSON.stringify(source)};
    ducument.head.appendChild(style);`;
  return str;
};