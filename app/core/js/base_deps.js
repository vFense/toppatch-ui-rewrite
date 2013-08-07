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
        'base_view',
        'base_router',
        'es5-shim'
    ],
    function() {
        "use strict";
        GLOBALS.App = {
            vent: _.extend({}, Backbone.Events)
        };
    }
);
