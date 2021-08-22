const { getAST, getDependencies, transform } = require('./parser');
const path = require('path');

const ast = getAST(path.join(__dirname, '../src/index.js')); // 获取ast

const dependencies = getDependencies(ast); // 获取依赖
const source = transform(ast); // 将es6代码转换为es5

console.log(source);
// console.log(dependencies);
// console.log(ast);
