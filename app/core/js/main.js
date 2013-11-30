define(
    ['core/js/TopPatch/TopPatch'],
    function (TopPatch) {
        'use strict';
        TopPatch.router = new TopPatch.Router();
        Backbone.history.start();
    }
);
