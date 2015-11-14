var path = require('path');

var MODULE_REGEXP = /(^|;)\s*goog\.module\s*\(\s*['""]/m;

var createPreprocesor = function(logger, /* config.basePath */ basePath) {
  var log = logger.create('preprocessor.googmodule');

  return function(content, file, done) {
    if (path.extname(file.originalPath) !== '.js' ||
        // Only check the first 1500 chars, for performance reasons.
        // That's enough for the Apache license and similar headers.
        !MODULE_REGEXP.test(content.substring(0, 1500))) {
      return done(content);
    }

    var relativePath = path.relative(basePath, file.originalPath);

    log.debug('Processing "%s".', file.originalPath);

    var content = JSON.stringify(content + '\n//# sourceURL=' + relativePath + '\n');
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
