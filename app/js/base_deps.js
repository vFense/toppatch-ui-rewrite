define(function(require) {
    "use strict";
    GLOBALS.App = {};

    // Load global dependencies
    require('respond');
    require('jquery');
    GLOBALS._ = require('underscore');
    GLOBALS.Backbone = require('backbone');
    require('backbone.localStorage');
    require('backbone.modelBinder');
    require('backbone.validation');
    require('js/base_view');
    require('js/base_router');
    require('es5-shim');
});
