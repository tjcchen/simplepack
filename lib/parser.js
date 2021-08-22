// 1. ES6 => AST => ES5
// 2. 分析依赖

const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { transformFromAstSync } = require('@babel/core');

module.exports = {
  // 将js文件内容转换为AST
  getAST: (path) => {
    const source = fs.readFileSync(path, 'utf-8');
    return parser.parse(source, { sourceType: 'module' });
  },
  // 分析依赖, eg: [ './greeting' ]
  getDependencies: (ast) => {
    const dependencies = [];
    traverse(ast, {
      ImportDeclaration: ({ node }) => {
        dependencies.push(node.source.value);
      }
    });
    return dependencies;
  },
  // 将ast代码转化为es5
  transform: (ast) => {
    // 添加presets env环境用来支持 es6 语法
    const { code } = transformFromAstSync(ast, null, { presets: ['env'] });
    return code;
  }
};