define(
    [
        'core/js/router',
        'core/js/TopPatch/auth',
        'core/js/TopPatch/functions',
        'core/js/outletView',
        'require'
    ],
    function (Router, Auth, fn, View, require) {
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
            show: function (view) {
                if (fn.currentView !== this.outlet) {
                    fn.show(this.outlet);
                }
                this.outlet.show(view);
                return this;
            },

            /***************
             * Core Routes *
             ***************/
            root: function () {
                if (this.currentView) {
                    this.currentView.close();
                }
                this.currentView = null;
                $(this.$selector).html('logged in');
                return this;
            },
            login: function () {
                var router = this;
                // No need to show login page if already logged in
                if (Auth.signedIn === true) {
                    return this.navigate('', {trigger:true, replace: true});
                }
                require(['core/js/TopPatch/login'], function (View) {
                    var view = new View();
                    router.show(view.render());
                });
                return this;
            },
            logout: function () {
                Auth.signOut().then(
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
