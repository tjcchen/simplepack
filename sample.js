/**
 * A simple module wrapper sample
 */

 (function(modules) {
  var installedModules = {};

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

  __webpack_require__(0);
})([
  /* 0 module */
  (function(module, __webpack_exports__, __webpack_require__) {
    console.log('module 0');
  }),

  /* 1 module */
  (function(module, __webpack_exports__, __webpack_require__) {
    console.log('module 1');
  }),
  
  /* n module */
  (function(module, __webpack_exports__, __webpack_require__) {
    console.log('module n');
  })
]);