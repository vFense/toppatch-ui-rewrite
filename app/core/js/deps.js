define(
    [
        'jquery',
        'underscore',
        'backbone'
    ],
    function() {
        'use strict';
        GLOBALS.App = {
            vent: _.extend({}, Backbone.Events)
        };
    }
);
