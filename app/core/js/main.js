define(
    ['core/js/TopPatch/TopPatch', 'require'],
    function (TopPatch, require) {
        'use strict';
        var deferred = {
            RVault: true
        };

        TopPatch.defaultRoute = 'rvault';
        TopPatch.Routers = {};

        // Load Core router
        deferred.core = $.Deferred();
        require(
            ['core/js/routes/router'],
            function (Router) {
                TopPatch.Routers.core = new Router();
                deferred.core.resolve();
            },
            function (error) {
                deferred.core.reject();
                throw error;
            }
        );

        // Load plugin routers
        if (deferred.RVault) {
            deferred.RVault = $.Deferred();
            require(
                ['rvault/js/routes/router'],
                function (Router) {
                    deferred.core.then(function () {
                        TopPatch.Routers.RVault = new Router();
                        deferred.RVault.resolve();
                    });
                },
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
