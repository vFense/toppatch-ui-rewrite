define(
    [
        'respond',
        'jquery',
        'underscore',
        'backbone',
        'backbone.babysitter',
        'backbone.localStorage',
        'backbone.modelBinder',
        'backbone.validation',
        'core/js/base_view',
        'core/js/base_router',
        'es5-shim'
    ],
    function() {
        "use strict";
        GLOBALS.App = {
            vent: _.extend({}, Backbone.Events)
        };
    }
);
