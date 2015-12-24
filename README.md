# dependify

**A Browserify plugin to produce UMD standalone bundles that support AMD, CommonJS or global dependencies**

Browserify's native standalone mode only supports CommonJS external dependencies which are not well suited for the web.  Dependify allows you to use everything that Broswerify has to offer for your build step while still consuming the bundled file using your current methodology.

## Why

The original purpose of this plugin was to be able to author AMD modules that could be loaded individually for testing and development then bundled with Browserify and deployed as a single UMD resource.  By writing each file as a separate AMD module using RequireJS's simplified CommonJS wrapper, the test harness would only need to be aware of the AMD configuration while the module explicitly declared its dependencies.  Once bundled the individual AMD modules were stripped out using the [deAMDify](https://github.com/jaredhanson/deamdify) transform and wrapped as a single UMD resource that correctly supplies its external dependencies.

## Installation

<code>npm install -save dependify</code>

## Usage

```js
var browserify = require('browserify');
var dependify = require('dependify');

browserify('PATH_TO_YOUR_ENTRY_FILE', {
    debug: true
}).plugin(dependify, {
    name: 'MyModule',
    deps: {
        'jquery': 'jQuery'  // require('jquery') will use AMD's and CommonJS's require('jquery') or the jQuery global object.
    }
});
```

## Options

Dependify takes the following options

* <code>name</code> [String] - The global variable to export when not using AMD or CommonJS.  Same as Browserify's <code>standalone</code> option.  This option is required and an error will be thrown if it is not present.
* <code>deps</code> [Object] - A map of external dependencies.  The key should match the string passed into Node's <code>require()</code> method and should match the AMD or CommonJS dependency.  The value is the global variable to import when not using AMD or CommonJS.  The keys are also added to Browserify's external collection so they won't be resolved.  This option is optional, but is basically the entire purpose of this plugin.

## License

**dependify** is Copyright (c) 2015 Ryan Turnquist and licensed under the [MIT license](http://opensource.org/licenses/MIT). All rights not explicitly granted in the MIT license are reserved.
