// Load the preprocessor directly.
var googmodule = require('./lib/googmodule.js');

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    preprocessors: {'**/*.js': ['googmodule']},
    files: [
      'e2e-test/base.js',
      'e2e-test/*.sample.js',
      'e2e-test/*.spec.js'
    ],
    plugins: ['karma-jasmine', googmodule],
    browsers: process.env.TRAVIS ? ['Firefox'] : ['Chrome'],
    reporters: ['dots'],
  });
};
