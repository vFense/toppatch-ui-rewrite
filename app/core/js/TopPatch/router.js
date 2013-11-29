define(
    ['require', 'core/js/TopPatch/auth', 'core/js/router'],
    function (require, Auth, Router) {
        'use strict';
        var PrimaryRouter = Router.extend({
            routes: {
                // Core Routes
                '': 'root',
                'login': 'login',
                'logout': 'logout',
                'forgotPassword': 'forgotPassword',

                // Module Loaders
                'rvault(/*subroute)': 'loadRVault',

                // Invalid Route
                '*path': 'invalidPath'
            },

            $selector: '#dashboard',
            show: function (view) {
                if (this.currentView) {
                    this.currentView.close();
                }
                $(this.$selector).html(view.render().$el);
                this.currentView = view;
                return view;
            },

            /***************
             * Core Routes *
             ***************/
            root: function () {
                window.console.log('route:root');
            },
            login: function () {
                window.console.log('route:login');
                var router = this;
                // No need to show login page if already logged in
                if (Auth.signedIn === true) {
                    return this.navigate('', {trigger:true, replace: true});
                }
                require(['core/js/TopPatch/login'], function (View) {
                    router.show(new View());
                });
            },
            logout: function () {
                window.console.log('route:logout', arguments);
                Auth.signOut().then(
                    _.bind(function () {
                        return this.navigate('login', {trigger:true, replace: true});
                    }, this)
                );
            },
            forgotPassword: function () {
                window.console.log('route:forgotPassword', arguments);
            },

            /******************
             * Module loaders *
             ******************/
            loadRVault: function () {
                var router = this;
                require(
                    'rvault/js/routes',
                    function () {
                        window.console.log('rvault loaded');
                    },
                    function () {
                        router.invalidPath(Backbone.history.getFragment());
                    }
                );
                this.loadRVault = $.noop;
            },

            /*****************
             * Invalid Route *
             *****************/
            'invalidPath': function () {
                window.console.log('route:invalid', arguments);
            }
        });
        return new PrimaryRouter();
    }
);
