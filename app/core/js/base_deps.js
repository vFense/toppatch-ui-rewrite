define(
    [
        'respond',
        '../.',
        'underscore',
        'backbone',
        'backbone.localStorage',
        'backbone.modelBinder',
        'backbone.validation',
        'js/base_view',
        'js/base_router',
        'es5-shim'
    ],
    function() {
        "use strict";
        GLOBALS.App = {
            vent: _.extend({}, Backbone.Events)
        };
    }
);
