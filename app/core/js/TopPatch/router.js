define(
    [
        'core/js/outletRouter',
        'core/js/views/outlet',
        'require'
    ],
    function (Router, View, require) {
        'use strict';
        var outletView = new View();
        return Router.extend({
            routes: {
                // Core Routes
                '': 'root',
                'login': 'login',
                'logout': 'logout',
                'forgotPassword': 'forgotPassword',

                // Invalid Route
                '*path': 'invalidPath'
            },

            outlet: outletView,

            /***************
             * Core Routes *
             ***************/
            root: function () {
                return this.navigate(TopPatch.defaultRoute, {trigger: true, replace: true});
            },
            login: function () {
                var router = this;
                // No need to show login page if already logged in
                if (TopPatch.Auth.signedIn === true) {
                    return this.navigate('', {trigger:true, replace: true});
                }
                require(['core/js/views/login'], function (View) {
                    var view = new View();
                    router.show(view.render());
                });
                return this;
            },
            logout: function () {
                TopPatch.Auth.signOut().then(
                    _.bind(function () {
                        return this.navigate('login', {trigger:true, replace: true});
                    }, this)
                );
                return this;
            },
            forgotPassword: $.noop,

            /*****************
             * Invalid Route *
             *****************/
            'invalidPath': function () {
                window.console.log('route:invalid', arguments);
            }
        });
    }
);
