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

        // Vendor Library Paths
        'almond'                : 'vendorPath/almond/almond',
        'backbone.localStorage' : 'vendorPath/backbone.localStorage/backbone.localStorage',
        'backbone'              : 'vendorPath/backbone-amd/backbone',
        'highcharts'            : 'vendorPath/highcharts-components/highcharts.src',
        'highcharts-more'       : 'vendorPath/highcharts-components/highcharts-more.src',
        'jquery-core'           : 'vendorPath/jquery/jquery',
        'jquery'                : 'vendorPath/jquery/jquery-migrate',
        'livestamp'             : 'vendorPath/livestampjs/livestamp',
        'moment'                : 'vendorPath/moment/moment',
        'qunit'                 : 'vendorPath/qunit/qunit/qunit',
        'respond'               : 'vendorPath/respond/respond.src',
        'select2'               : 'vendorPath/select2/select2',
        'underscore'            : 'vendorPath/underscore-amd/underscore',

        // Bootstrap Paths
        'bootstrapPath'         : 'vendorPath/bootstrap/js',
        'bootstrap.affix'       : 'bootstrapPath/affix',
        'bootstrap.alert'       : 'bootstrapPath/alert',
        'bootstrap.button'      : 'bootstrapPath/button',
        'bootstrap.carousel'    : 'bootstrapPath/carousel',
        'bootstrap.collapse'    : 'bootstrapPath/collapse',
        'bootstrap.dropdown'    : 'bootstrapPath/dropdown',
        'bootstrap.modal'       : 'bootstrapPath/modal',
        'bootstrap.popover'     : 'bootstrapPath/popover',
        'bootstrap.scrollspy'   : 'bootstrapPath/scrollspy',
        'bootstrap.tab'         : 'bootstrapPath/tab',
        'bootstrap.tooltip'     : 'bootstrapPath/tooltip',
        'bootstrap.transition'  : 'bootstrapPath/transition',
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
