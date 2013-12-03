define(
    ['core/js/TopPatch/TopPatch', 'require'],
    function (TopPatch, require) {
        'use strict';
        var plugins = {
            RVault: true
        };

        TopPatch.loading = true;
        TopPatch.router = new TopPatch.Router();
        TopPatch.modules = {};

        if (plugins.RVault) {
            plugins.RVault = $.Deferred();
            require(
                ['rvault/js/main'],
                plugins.RVault.resolve,
                function (error) {
                    plugins.RVault.reject();
                    throw error;
                }
            );
        }

        $.when.apply(null, _.values(plugins)).always(function () {
            Backbone.history.start();
        });
    }
);
