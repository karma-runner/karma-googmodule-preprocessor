# karma-googmodule

A preprocessor to handle Closure's goog.module() system. Rewrites source files
that declare modules using `goog.module()` so that they are properly loaded by
Closure's module loader.

See [e2e-test/module.spec.js](e2e-test/module.spec.js) for an example.
