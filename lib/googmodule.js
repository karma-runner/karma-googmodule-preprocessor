var path = require('path');

var MODULE_REGEXP = /(^|;)\s*goog\.module\s*\(\s*['""]/m;

var createPreprocesor = function(logger) {
  var log = logger.create('preprocessor.googmodule');

  return function(content, file, done) {
    if (path.extname(file.originalPath) !== '.js' ||
        !MODULE_REGEXP.test(content)) {
      return done(content);
    }

    log.debug('Processing "%s".', file.originalPath);

    // Make sure not to insert any line breaks before the content, so that line
    // numbers match the original. It's a poor man's source map, essentially.
    var output =
      '/* Generated from ' + file.originalPath + ' by karma-googmodule-preprocessor */ ' +
      'goog.loadModule(function(exports) { "use strict"; ' +
      content + ';\n' /* Semicolon insertion may insert ; before EOF, match that. */ +
      '  return exports;\n' +
      '});\n';

    done(output);
  };
};
createPreprocesor.$inject = ['logger'];

// PUBLISH DI MODULE
module.exports = {
  'preprocessor:googmodule': ['factory', createPreprocesor]
};

