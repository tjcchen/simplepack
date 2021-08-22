// 构建 + 输出
const { getAST, getDependencies, transform } = require('./parser');
const path = require('path');
const fs = require('fs');

module.exports = class Compiler {
  constructor(options) {
    const { entry, output } = options;
    this.entry = entry;
    this.output = output;
    this.modules = []; // 存放所有模块信息
  }

  run() {
    const entryModule = this.buildModule(this.entry, true);

    // 将入口模块放入this.modules
    this.modules.push(entryModule);
    // 递归遍历出所有模块
    this.modules.map((_module) => {
      _module.dependencies.map((dependency) => {
        this.modules.push(this.buildModule(dependency));
      });
    });

    // 利用this.modules信息生成文件
    this.emitFiles();
  }

  buildModule(filename, isEntry) {
    let ast;

    if (isEntry) { // 相对路径 
      ast = getAST(filename);
    } else { // 绝对路径
      const absolutePath = path.join(process.cwd(), './src', filename); // 将相对路径转为绝对路径, process.cwd()代表根目录
      ast = getAST(absolutePath);
    }

    return {
      filename,
      dependencies: getDependencies(ast),
      source: transform(ast)
    };
  }

  emitFiles() {
    const outputPath = path.join(this.output.path, this.output.filename);

    let modules = '';
    
    this.modules.map((_module) => {
      modules += `'${_module.filename}': function(require, module, exports) { ${_module.source} },`;
    });

    const bundle = `(function(modules) {
      function require(filename) {
        var fn = modules[filename];
        var module = {
          exports: {},
        };

        fn(require, module, module.exports);
        return module.exports;
      }

      require('${ this.entry }');
    })({ ${ modules } })`;

    fs.writeFileSync(outputPath, bundle, 'utf-8');
  }
}