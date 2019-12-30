var path = require('path');

// If the code has goog.module we need to wrap it.
var MODULE_REGEXP = /(^|;)\s*goog\.module\s*\(\s*['""]/m;
// If the code already has goog.base no wrapper even if goog.module.
var GOOGBASE_REGEXP = /^ \* @provideGoog *$/m;

var createPreprocesor = function(logger, /* config.basePath */ basePath) {
  var log = logger.create('preprocessor.googmodule');

  return function(content, file, done) {
    if (path.extname(file.originalPath) !== '.js') {
      return done(content);
    }
    // Only check the first 10k chars, for performance reasons, to avoid
    // degenerate behaviour on very large JS files. That's enough to allow
    // for the Apache license, docs, and similar headers.
    var first10k = content.substring(0, 10000);
    if (!MODULE_REGEXP.test(first10k) || GOOGBASE_REGEXP.test(first10k)) {
      return done(content);
    }

    var relativePath = path.relative(basePath, file.originalPath);

    log.debug('Processing "%s".', file.originalPath);

    var output = `/* Generated from ${relativePath} by karma-googmodule-preprocessor */
goog.loadModule(function(exports) {
"use strict";
${content}
//# sourceURL=http://googmodule/base/${relativePath}
return exports;
});
`;

    done(output);
  };
};
createPreprocesor.$inject = ['logger', 'config.basePath'];

// PUBLISH DI MODULE
module.exports = {
  'preprocessor:googmodule': ['factory', createPreprocesor]
};
