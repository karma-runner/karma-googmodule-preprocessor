var path = require('path');

// If the code has goog.module we need to wrap it.
var MODULE_REGEXP = /(^|;|\*\/)\s*goog\.module\s*\(\s*['""]/m;
// If the code already has goog.base no wrapper even if goog.module.
var GOOGBASE_REGEXP = /^ \* @provideGoog *$/m;

var createPreprocesor = function(logger, /* config.basePath */ basePath) {
  var log = logger.create('preprocessor.googmodule');

  return function(content, file, done) {
    if (path.extname(file.originalPath) !== '.js') {
      return done(content);
    }
    // Only check the first characters, for performance reasons, to avoid
    // degenerate behaviour on very large JS files. That's enough to allow
    // for the Apache license, docs, and similar headers.
    var sniffRegion = content.substring(0, 50000);
    if (!MODULE_REGEXP.test(sniffRegion) || GOOGBASE_REGEXP.test(sniffRegion)) {
      return done(content);
    }

    var relativePath = path.relative(basePath, file.originalPath);

    log.debug('Processing "%s".', file.originalPath);

    // Path must include http:// protocol and '/base/' so that Karma can still recognize the URL
    // and apply source maps.
    content =
        JSON.stringify(content + '\n//# sourceURL=http://googmodule/base/' + relativePath + '\n');
    // Make sure not to insert any line breaks before the content, so that line
    // numbers match the original. It's a poor man's source map, essentially.
    var output = '/* Generated from ' + relativePath + ' by karma-googmodule-preprocessor */ ' +
                 'goog.loadModule(' + content + ');\n';
    done(output);
  };
};
createPreprocesor.$inject = ['logger', 'config.basePath'];

// PUBLISH DI MODULE
module.exports = {
  'preprocessor:googmodule': ['factory', createPreprocesor]
};
