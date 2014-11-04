var path = require('path');

var MODULE_REGEXP = /^\s*goog\.module\s*\(\s*['""]/m;

var createPreprocesor = function(logger) {
  var log = logger.create('preprocessor.googmodule');

  return function(content, file, done) {
    if (path.extname(file.originalPath) !== '.js' ||
        !MODULE_REGEXP.test(content)) {
      return done(content);
    }

    log.debug('Processing "%s".', file.originalPath);

    content =
        content + '\n//# sourceURL=http://googmodule' + file.originalPath;
    content = JSON.stringify(content);

    var output =
      '// Generated from ' + file.originalPath + ' by googmodule.js\n' +
      'try {\n' +
      // Wrap in a goog.loadModule statement.
      '  goog.loadModule(' + content + ');\n' +
      '} catch (e) {\n'+
      '  if (!e.fileName) e.message += ' + JSON.stringify(' @ ' + file.originalPath) + ';\n' +
      '  throw e;\n' +
      '}\n';

    done(output);
  };
};
createPreprocesor.$inject = ['logger'];

// PUBLISH DI MODULE
module.exports = {
  'preprocessor:googmodule': ['factory', createPreprocesor]
};

