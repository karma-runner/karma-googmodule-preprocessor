var assert = require('chai').assert;
var sinon = require('sinon');

var googmodule = require('../lib/googmodule.js');

describe('googmodule loader', function() {
  var createPreprocessor = googmodule['preprocessor:googmodule'][1];
  var loggerMock = {create: function() { return {debug: function() {}}; }};


  var preprocessor, doneFn;

  beforeEach(function() {
    preprocessor = createPreprocessor(loggerMock, '/base/path');
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
                 {originalPath: '/base/path/some/file.js'}, doneFn);
    var expected = '/* Generated from some/file.js by karma-googmodule-preprocessor */ ' +
                   'goog.loadModule("goog.module(\'my.module\');\\ncontent();\\n' +
                   '//# sourceURL=some/file.js\\n");\n';
    sinon.assert.calledWith(doneFn, expected);
  });

  it('handles modules starting with comments', function() {
    preprocessor('/** @fileoverview Hello. */\n\n' +
                 'goog.module(\'my.module\');\ncontent();',
                 {originalPath: '/some/file.js'}, doneFn);
    sinon.assert.calledWith(doneFn, sinon.match(/goog\.loadModule/));
  });

  it('handles goog.module statements after semicolons', function() {
    preprocessor('var l5_cov=1; goog.module(\'my.module\');\ncontent();',
                 {originalPath: '/some/file.js'}, doneFn);
    sinon.assert.calledWith(doneFn, sinon.match(/goog\.loadModule/));
  });
});
