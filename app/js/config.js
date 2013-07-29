requirejs.config({
    // baseURL: The root path to use for all module lookups.
    // See: http://requirejs.org/docs/api.html#config-baseUrl
    baseUrl: './',

    // paths: Path mappings for module names not found directly under baseUrl.
    // See: http://requirejs.org/docs/api.html#config-paths
    paths: {
        // RequireJS Plugins
        'async'         : '../vendor/requirejs-plugins/src/async',
        'depend'        : '../vendor/requirejs-plugins/src/depend',
        'font'          : '../vendor/requirejs-plugins/src/font',
        'goog'          : '../vendor/requirejs-plugins/src/goog',
        'image'         : '../vendor/requirejs-plugins/src/image',
        'json'          : '../vendor/requirejs-plugins/src/json',
        'mdown'         : '../vendor/requirejs-plugins/src/mdown',
        'noext'         : '../vendor/requirejs-plugins/src/noext',
        'propertyParser': '../vendor/requirejs-plugins/src/propertyParser',
        'text'          : '../vendor/requirejs-text/text',

        // Vendor Library Paths
        'almond'                : '../vendor/almond/almond',
        'backbone'              : '../vendor/backbone-amd/backbone',
        'backbone.localStorage' : '../vendor/backbone.localStorage/backbone.localStorage',
        'highcharts'            : '../vendor/highcharts-components/highcharts.src',
        'highcharts-more'       : '../vendor/highcharts-components/highcharts-more.src',
        'jquery'                : '../vendor/jquery/jquery-migrate',
        'livestamp'             : '../vendor/livestampjs/livestamp',
        'moment'                : '../vendor/moment/moment',
        'qunit'                 : '../vendor/qunit/qunit/qunit',
        'respond'               : '../vendor/respond/respond.src',
        'select2'               : '../vendor/select2/select2',
        'underscore'            : '../vendor/underscore-amd/underscore',

        // Bootstrap Paths
        'bootstrap.affix'       : '../vendor/bootstrap/js/affix',
        'bootstrap.alert'       : '../vendor/bootstrap/js/alert',
        'bootstrap.button'      : '../vendor/bootstrap/js/button',
        'bootstrap.carousel'    : '../vendor/bootstrap/js/carousel',
        'bootstrap.collapse'    : '../vendor/bootstrap/js/collapse',
        'bootstrap.dropdown'    : '../vendor/bootstrap/js/dropdown',
        'bootstrap.modal'       : '../vendor/bootstrap/js/modal',
        'bootstrap.popover'     : '../vendor/bootstrap/js/popover',
        'bootstrap.scrollspy'   : '../vendor/bootstrap/js/scrollspy',
        'bootstrap.tab'         : '../vendor/bootstrap/js/tab',
        'bootstrap.tooltip'     : '../vendor/bootstrap/js/tooltip',
        'bootstrap.transition'  : '../vendor/bootstrap/js/transition',

        // jQuery UI Paths
        'jquery.ui.core'        : '../vendor/jquery-ui/ui/jquery.ui.core',
        'jquery.ui.widget'      : '../vendor/jquery-ui/ui/jquery.ui.widget',
        'jquery.ui.mouse'       : '../vendor/jquery-ui/ui/jquery.ui.mouse',
        'jquery.ui.position'    : '../vendor/jquery-ui/ui/jquery.ui.position',
        'jquery.ui.draggable'   : '../vendor/jquery-ui/ui/jquery.ui.draggable',
        'jquery.ui.droppable'   : '../vendor/jquery-ui/ui/jquery.ui.droppable',
        'jquery.ui.resizable'   : '../vendor/jquery-ui/ui/jquery.ui.resizable',
        'jquery.ui.selectable'  : '../vendor/jquery-ui/ui/jquery.ui.selectable',
        'jquery.ui.sortable'    : '../vendor/jquery-ui/ui/jquery.ui.sortable',
        'jquery.ui.accordion'   : '../vendor/jquery-ui/ui/jquery.ui.accordion',
        'jquery.ui.autocomplete': '../vendor/jquery-ui/ui/jquery.ui.autocomplete',
        'jquery.ui.button'      : '../vendor/jquery-ui/ui/jquery.ui.button',
        'jquery.ui.datepicker'  : '../vendor/jquery-ui/ui/jquery.ui.datepicker',
        'jquery.ui.dialog'      : '../vendor/jquery-ui/ui/jquery.ui.dialog',
        'jquery.ui.menu'        : '../vendor/jquery-ui/ui/jquery.ui.menu',
        'jquery.ui.progressbar' : '../vendor/jquery-ui/ui/jquery.ui.progressbar',
        'jquery.ui.slider'      : '../vendor/jquery-ui/ui/jquery.ui.slider',
        'jquery.ui.spinner'     : '../vendor/jquery-ui/ui/jquery.ui.spinner',
        'jquery.ui.tabs'        : '../vendor/jquery-ui/ui/jquery.ui.tabs',
        'jquery.ui.tooltip'     : '../vendor/jquery-ui/ui/jquery.ui.tooltip'
    },

    // shim: Configure dependencies, exports, and custom initialization for non-AMD scripts.
    // See: http://requirejs.org/docs/api.html#config-shim
    shim: {
        // Note: 'jquery' = jquery-migrate
        'jquery'          : { exports: 'jQuery', deps: ['../vendor/jquery/jquery'] },

        // Vendor Library Shims
        'highcharts'      : { exports: 'Highcharts' },
        'highcharts-more' : { exports: 'Highcharts.seriesTypes.bubble', deps: ['highcharts'] },
        'livestamp'       : { exports: '$.livestamp', deps: ['jquery', 'moment'] },

        // Bootstrap Shims
        'bootstrap-affix'       : { exports: 'jQuery.fn.affix',           deps: ['jquery'] },
        'bootstrap-alert'       : { exports: 'jQuery.fn.alert',           deps: ['jquery'] },
        'bootstrap-button'      : { exports: 'jQuery.fn.button',          deps: ['jquery'] },
        'bootstrap-carousel'    : { exports: 'jQuery.fn.carousel',        deps: ['jquery'] },
        'bootstrap-collapse'    : { exports: 'jQuery.fn.collapse',        deps: ['jquery'] },
        'bootstrap-dropdown'    : { exports: 'jQuery.fn.dropdown',        deps: ['jquery'] },
        'bootstrap-modal'       : { exports: 'jQuery.fn.modal',           deps: ['jquery'] },
        'bootstrap-popover'     : { exports: 'jQuery.fn.popover',         deps: ['jquery', 'bootstrap-tooltip'] },
        'bootstrap-scrollspy'   : { exports: 'jQuery.fn.scrollspy',       deps: ['jquery'] },
        'bootstrap-tab'         : { exports: 'jQuery.fn.tab',             deps: ['jquery'] },
        'bootstrap-tooltip'     : { exports: 'jQuery.fn.tooltip',         deps: ['jquery'] },
        'bootstrap-transition'  : { exports: 'jQuery.support.transition', deps: ['jquery'] },
        'bootstrap-typeahead'   : { exports: 'jQuery.fn.typeahead',       deps: ['jquery'] },
    },

    // deps: An array of dependencies to load as soon as require() is defined.
    // See: http://requirejs.org/docs/api.html#config-deps
    deps: (function() {}()),

    // callback: A function to execute after deps have been loaded.
    // See: http://requirejs.org/docs/api.html#config-callback
    callback: function () { 'use strict'; return this; }
});
