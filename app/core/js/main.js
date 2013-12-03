define(
    ['core/js/TopPatch/TopPatch', 'require'],
    function (TopPatch, require) {
        'use strict';
        var deferred = {
            RVault: true
        };

        TopPatch.loading = true;
        TopPatch.router = new TopPatch.Router();
        TopPatch.modules = {};

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

        // The following deferred should be moved to Auth
        deferred.userRequest = $.ajax('api/user')
            .done(function () {
                TopPatch.Auth.signedIn = true;
            })
        ;

        $.when.apply(null, _.values(deferred)).always(function () {
            Backbone.history.start();
        });
    }
);
