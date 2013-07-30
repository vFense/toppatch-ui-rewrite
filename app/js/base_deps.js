define(function(require) {
    "use strict";
    // Load global dependencies
    require('respond');
    require('jquery');
    GLOBALS._ = require('underscore');
    GLOBALS.Backbone = require('backbone');
    require('backbone.localStorage');
    require('backbone.modelBinder');
    require('backbone.validation');
    require('es5-shim');
});
