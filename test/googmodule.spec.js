var assert = require('chai').assert;
var sinon = require('sinon');

var googmodule = require('../lib/googmodule.js');

describe('googmodule loader', function() {
  var createPreprocessor = googmodule['preprocessor:googmodule'][1];
  var loggerMock = {create: function() { return {debug: function() {}}; }};


  var preprocessor, doneFn;

  beforeEach(function() {
    preprocessor = createPreprocessor(loggerMock);
    doneFn = sinon.spy();
  });

  it('ignores non-js files', function() {
    preprocessor('content', {originalPath: '/some/template.html'}, doneFn);
    sinon.assert.calledWith(doneFn, 'content');
  });

  it('ignores non-goog.module files', function() {
    preprocessor('content();', {originalPath: '/some/file.js'}, doneFn);
    sinon.assert.calledWith(doneFn, 'content();');
  });

  it('transforms goog.module files', function() {
    preprocessor('goog.module(\'my.module\');\ncontent();',
                 {originalPath: '/some/file.js'}, doneFn);
    var expected =
        '// Generated from /some/file.js by googmodule.js\n' +
        'try {\n' +
        '  goog.loadModule("goog.module(\'my.module\');\\n' +
        'content();\\n//# sourceURL=http://googmodule/some/file.js");\n' +
        '} catch (e) {\n' +
        '  if (!e.fileName) e.message += " @ /some/file.js";\n' +
        '  throw e;\n' +
        '}\n';
    sinon.assert.calledWith(doneFn, expected);
  });
});
