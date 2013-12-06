define(
    ['core/js/TopPatch/TopPatch', 'require'],
    function (TopPatch, require) {
        'use strict';
        var deferred = {
            RVault: true
        };

        TopPatch.defaultRoute = 'rvault';
        TopPatch.router = new TopPatch.Router();
        TopPatch.modules = {};
        TopPatch.Routers = {};

        if (deferred.RVault) {
            deferred.RVault = $.Deferred();
            require(
                ['rvault/js/main'],
                deferred.RVault.resolve,
                function (error) {
                    deferred.RVault.reject();
                    throw error;
                }
            );
        }

        deferred.userRequest = TopPatch.Auth.rememberMeSignIn();

        $.when.apply(null, _.values(deferred)).always(function () {
            Backbone.history.start();
        });
    }
);
