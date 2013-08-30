/*exported requirejs */
var requirejs = {
    // enforceDefine: If set to true, an error will be thrown if a script loads
    // that does not call define() or have a shim exports string value that can
    // be checked. This helps catch load failures in IE.
    // See: http://requirejs.org/docs/api.html#ieloadfail
    enforceDefine: true,

    // baseURL: The root path to use for all module lookups.
    // See: http://requirejs.org/docs/api.html#config-baseUrl
    baseUrl: './',

    // paths: Path mappings for module names not found directly under baseUrl.
    // See: http://requirejs.org/docs/api.html#config-paths
    paths: {
        // RequireJS Plugins
        'async'         : 'vendor/requirejs-plugins/src/async',
        'font'          : 'vendor/requirejs-plugins/src/font',
        'goog'          : 'vendor/requirejs-plugins/src/goog',
        'image'         : 'vendor/requirejs-plugins/src/image',
        'json'          : 'vendor/requirejs-plugins/src/json',
        'noext'         : 'vendor/requirejs-plugins/src/noext',
        'propertyParser': 'vendor/requirejs-plugins/src/propertyParser',
        'text'          : 'vendor/requirejs-text/text',

        // Vendor Library Paths
        'handlebars'            : 'vendor/handlebars.js/dist/handlebars.runtime',
        'highcharts'            : 'vendor/highcharts-components/highcharts.src',
        'highcharts-more'       : 'vendor/highcharts-components/highcharts-more.src',
        'jquery'                : 'vendor/jquery/jquery',
        'livestamp'             : 'vendor/livestampjs/livestamp',
        'moment'                : 'vendor/moment/moment',
        'select2'               : 'vendor/select2/select2',
        'underscore'            : 'vendor/underscore/underscore',

        // Backbone Paths
        'backbone'              : 'vendor/backbone/backbone',
        'backbone.babysitter'   : 'vendor/backbone.babysitter/lib/amd/backbone.babysitter',
        'backbone.localStorage' : 'vendor/backbone.localstorage/backbone.localStorage',
        'backbone.modelBinder'  : 'vendor/backbone.modelbinder/Backbone.ModelBinder',
        'backbone.validation'   : 'vendor/backbone-validation/src/backbone-validation',

        // Bootstrap Paths
        'bootstrap.affix'       : 'vendor/bootstrap/js/affix',
        'bootstrap.alert'       : 'vendor/bootstrap/js/alert',
        'bootstrap.button'      : 'vendor/bootstrap/js/button',
        'bootstrap.carousel'    : 'vendor/bootstrap/js/carousel',
        'bootstrap.collapse'    : 'vendor/bootstrap/js/collapse',
        'bootstrap.dropdown'    : 'vendor/bootstrap/js/dropdown',
        'bootstrap.modal'       : 'vendor/bootstrap/js/modal',
        'bootstrap.popover'     : 'vendor/bootstrap/js/popover',
        'bootstrap.scrollspy'   : 'vendor/bootstrap/js/scrollspy',
        'bootstrap.tab'         : 'vendor/bootstrap/js/tab',
        'bootstrap.tooltip'     : 'vendor/bootstrap/js/tooltip',
        'bootstrap.transition'  : 'vendor/bootstrap/js/transition',

        // jQuery UI Paths
        'jquery.ui.core'        : 'vendor/jquery-ui/ui/jquery.ui.core',
        'jquery.ui.widget'      : 'vendor/jquery-ui/ui/jquery.ui.widget',
        'jquery.ui.mouse'       : 'vendor/jquery-ui/ui/jquery.ui.mouse',
        'jquery.ui.position'    : 'vendor/jquery-ui/ui/jquery.ui.position',
        'jquery.ui.draggable'   : 'vendor/jquery-ui/ui/jquery.ui.draggable',
        'jquery.ui.droppable'   : 'vendor/jquery-ui/ui/jquery.ui.droppable',
        'jquery.ui.resizable'   : 'vendor/jquery-ui/ui/jquery.ui.resizable',
        'jquery.ui.selectable'  : 'vendor/jquery-ui/ui/jquery.ui.selectable',
        'jquery.ui.sortable'    : 'vendor/jquery-ui/ui/jquery.ui.sortable',
        'jquery.ui.accordion'   : 'vendor/jquery-ui/ui/jquery.ui.accordion',
        'jquery.ui.autocomplete': 'vendor/jquery-ui/ui/jquery.ui.autocomplete',
        'jquery.ui.button'      : 'vendor/jquery-ui/ui/jquery.ui.button',
        'jquery.ui.datepicker'  : 'vendor/jquery-ui/ui/jquery.ui.datepicker',
        'jquery.ui.dialog'      : 'vendor/jquery-ui/ui/jquery.ui.dialog',
        'jquery.ui.menu'        : 'vendor/jquery-ui/ui/jquery.ui.menu',
        'jquery.ui.progressbar' : 'vendor/jquery-ui/ui/jquery.ui.progressbar',
        'jquery.ui.slider'      : 'vendor/jquery-ui/ui/jquery.ui.slider',
        'jquery.ui.spinner'     : 'vendor/jquery-ui/ui/jquery.ui.spinner',
        'jquery.ui.tabs'        : 'vendor/jquery-ui/ui/jquery.ui.tabs',
        'jquery.ui.tooltip'     : 'vendor/jquery-ui/ui/jquery.ui.tooltip'
    },

    // shim: Configure dependencies, exports, and custom initialization for non-AMD scripts.
    // See: http://requirejs.org/docs/api.html#config-shim
    shim: {
        // Vendor Library Shims
        'backbone'              : { exports: 'Backbone', deps: ['underscore', 'jquery'] },
        'backbone.validation'   : { exports: 'Backbone.Validation', deps: ['backbone']},
        'handlebars'            : { exports: 'Handlebars' },
        'highcharts'            : { exports: 'Highcharts' },
        'highcharts-more'       : { exports: 'Highcharts.seriesTypes.bubble', deps: ['highcharts'] },
        'livestamp'             : { exports: '$.livestamp', deps: ['jquery', 'moment'] },
        'select2'               : { exports: 'Select2', deps: ['jquery']},
        'underscore'            : { exports: '_' },

        // Bootstrap Shims
        'bootstrap.affix'       : { exports: 'jQuery.fn.affix',           deps: ['jquery'] },
        'bootstrap.alert'       : { exports: 'jQuery.fn.alert',           deps: ['jquery'] },
        'bootstrap.button'      : { exports: 'jQuery.fn.button',          deps: ['jquery'] },
        'bootstrap.carousel'    : { exports: 'jQuery.fn.carousel',        deps: ['jquery'] },
        'bootstrap.collapse'    : { exports: 'jQuery.fn.collapse',        deps: ['jquery', 'bootstrap.transition'] },
        'bootstrap.dropdown'    : { exports: 'jQuery.fn.dropdown',        deps: ['jquery'] },
        'bootstrap.modal'       : { exports: 'jQuery.fn.modal',           deps: ['jquery'] },
        'bootstrap.popover'     : { exports: 'jQuery.fn.popover',         deps: ['jquery', 'bootstrap.tooltip'] },
        'bootstrap.scrollspy'   : { exports: 'jQuery.fn.scrollspy',       deps: ['jquery'] },
        'bootstrap.tab'         : { exports: 'jQuery.fn.tab',             deps: ['jquery'] },
        'bootstrap.tooltip'     : { exports: 'jQuery.fn.tooltip',         deps: ['jquery'] },
        'bootstrap.transition'  : { exports: 'jQuery.support.transition', deps: ['jquery'] },

        // jQuery UI Core Shims
        'jquery.ui.core'        : { exports: 'jQuery.ui',       deps: ['jquery']},
        'jquery.ui.widget'      : { exports: 'jQuery.widget',   deps: ['jquery']},
        'jquery.ui.mouse'       : { exports: 'jQuery.ui.mouse', deps: ['jquery', 'jquery.ui.core', 'jquery.ui.widget']},
        'jquery.ui.position'    : { exports: 'jQuery.position', deps: ['jquery']},

        // jQuery UI Interaction Shims
        'jquery.ui.draggable'   : { exports: 'jQuery.ui.draggable',  deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.mouse']},
        'jquery.ui.droppable'   : { exports: 'jQuery.ui.droppable',  deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.mouse', 'jquery.ui.draggable']},
        'jquery.ui.resizable'   : { exports: 'jQuery.ui.resizable',  deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.mouse']},
        'jquery.ui.selectable'  : { exports: 'jQuery.ui.selectable', deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.mouse']},
        'jquery.ui.sortable'    : { exports: 'jQuery.ui.sortable',   deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.mouse']},

        // jQuery UI Widget Shims
        'jquery.ui.accordion'   : { exports: 'jQuery.ui.accordion',    deps: ['jquery.ui.core', 'jquery.ui.widget']},
        'jquery.ui.autocomplete': { exports: 'jQuery.ui.autocomplete', deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.position', 'jquery.ui.menu']},
        'jquery.ui.button'      : { exports: 'jQuery.ui.button',       deps: ['jquery.ui.core', 'jquery.ui.widget']},
        'jquery.ui.datepicker'  : { exports: 'jQuery.ui.datepicker',   deps: ['jquery.ui.core']},
        'jquery.ui.dialog'      : { exports: 'jQuery.ui.dialog',       deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.mouse', 'jquery.ui.position', 'jquery.ui.draggable', 'jquery.ui.resizable', 'jquery.ui.button']},
        'jquery.ui.menu'        : { exports: 'jQuery.ui.menu',         deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.position']},
        'jquery.ui.progressbar' : { exports: 'jQuery.ui.progressbar',  deps: ['jquery.ui.core', 'jquery.ui.widget']},
        'jquery.ui.slider'      : { exports: 'jQuery.ui.slider',       deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.mouse']},
        'jquery.ui.spinner'     : { exports: 'jQuery.ui.spinner',      deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.button']},
        'jquery.ui.tabs'        : { exports: 'jQuery.ui.tabs',         deps: ['jquery.ui.core', 'jquery.ui.widget']},
        'jquery.ui.tooltip'     : { exports: 'jQuery.ui.tooltip',      deps: ['jquery.ui.core', 'jquery.ui.widget', 'jquery.ui.position']}
    },

    // deps: An array of dependencies to load as soon as require() is defined.
    // See: http://requirejs.org/docs/api.html#config-deps
    deps: ['jquery', 'underscore', 'backbone']

    // callback: A function to execute after deps have been loaded.
    // See: http://requirejs.org/docs/api.html#config-callback
    // callback: function () { 'use strict'; return this; }
};
