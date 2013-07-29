requirejs.config({
    // baseURL: The root path to use for all module lookups.
    // See: http://requirejs.org/docs/api.html#config-baseUrl
    baseUrl: './',

    // paths: Path mappings for module names not found directly under baseUrl.
    // See: http://requirejs.org/docs/api.html#config-paths
    paths: {
        'vendorPath' : '../vendor',
        
        // RequireJS Plugins
        'rjsPlugin'     : 'vendorPath/requirejs-plugins/src',
        'async'         : 'rjsPlugin/async',
        'depend'        : 'rjsPlugin/depend',
        'font'          : 'rjsPlugin/font',
        'goog'          : 'rjsPlugin/goog',
        'image'         : 'rjsPlugin/image',
        'json'          : 'rjsPlugin/json',
        'mdown'         : 'rjsPlugin/mdown',
        'noext'         : 'rjsPlugin/noext',
        'propertyParser': 'rjsPlugin/propertyParser',
        'text'          : 'vendorPath/requirejs-text/text',
    },

    // shim: Configure dependencies, exports, and custom initialization for non-AMD scripts.
    // See: http://requirejs.org/docs/api.html#config-shim
    shim: {},

    // deps: An array of dependencies to load as soon as require() is defined.
    // See: http://requirejs.org/docs/api.html#config-deps
    deps: (function() {}()),

    // callback: A function to execute after deps have been loaded.
    // See: http://requirejs.org/docs/api.html#config-callback
    callback: function () { 'use strict'; return this; }
});
