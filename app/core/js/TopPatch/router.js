define(
    ['require', 'core/js/TopPatch/auth', 'core/js/router'],
    function (require, Auth, Router) {
        'use strict';
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


            /*****************
             * Invalid Route *
             *****************/
            'invalidPath': function () {
                window.console.log('route:invalid', arguments);
            }
        });
    }
);
