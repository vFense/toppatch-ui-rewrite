/*globals libs */
$(document).ready(function () {
    'use strict';

    // The following code was adapted from Backbone's router unit test logic
    var Location = function(href) {
            this.replace(href);
        },
        location = null;

    libs._.extend(Location.prototype, {
        replace: function(href) {
            libs._.extend(this, libs._.pick($('<a></a>', {href: href})[0],
                'href',
                'hash',
                'host',
                'search',
                'fragment',
                'pathname',
                'protocol'
            ));
            // In IE, anchor.pathname does not contain a leading slash though
            // window.location.pathname does.
            if (!/^\//.test(this.pathname)) { this.pathname = '/' + this.pathname; }
        },
        toString: function() {
            return this.href;
        }
    });

    module('Router', {
        setup: function () {
            location = new Location('http://example.com');
            this.initHistory = function () {
                Backbone.history = _.extend(new Backbone.History(), {location: location});
                Backbone.history.interval = 9;
            };
            this.newLocation = function (href) {
                location.replace(href);
                Backbone.history.checkUrl();
                return this;
            };
        },
        teardown: function() {
            Backbone.history.stop();
        }
    });

    // Start custom test logic
    asyncTest('Test fragmentHistory', function () {
        var testSuite = this;
        require(['core/js/router'], function(Router) {
            testSuite.initHistory();
            var router = new (Router.extend({
                    routes: {
                        '*any': $.noop
                    }
                }))();
            ok(_.isNull(router.currentFragment), 'Current fragment is null before history start');
            ok(_.isNull(router.lastFragment), 'Last fragment is null before history start');

            Backbone.history.start({pushState: false});
            strictEqual(router.currentFragment, '', 'Current fragment is ""');
            ok(_.isNull(router.lastFragment), 'Last fragment is still null');

            // Navigate to #test1
            testSuite.newLocation('http://example.com/#test1');
            strictEqual(router.currentFragment, 'test1', 'Current fragment is "test1"');
            strictEqual(router.lastFragment, '', 'Last fragment is ""');

            // Navigate to #test1 again
            router.navigate('test1', {trigger: true, replace: true});
            strictEqual(router.currentFragment, 'test1', 'Current fragment is "test1"');
            strictEqual(router.lastFragment, '', 'Last fragment is ""');

            // Navigate to #test2
            router.navigate('test2', {trigger: true, replace: true});
            strictEqual(router.currentFragment, 'test2', 'Current fragment is "test2"');
            strictEqual(router.lastFragment, 'test1', 'Last fragment is "test1"');

            start();
        });
    });

    asyncTest('authRoute argument parsing', function () {
        var testSuite = this;
        require(['core/js/router', 'core/js/TopPatch/auth'], function(Router, Auth) {
            testSuite.initHistory();

            var test3Called = false,
                test4Called = false,
                test5Called = false,
                AuthRouter = Router.extend({
                    test3: function () {
                        test3Called = true;
                    }
                }),
                router = new AuthRouter();

            Auth.signedIn = true;
            Backbone.history.start({pushState: false});


            // Route argument is string, name and callback are undefined
            ok(router.authRoute('test1'), 'Attempt to define authRoute with route argument as string');
            strictEqual(Backbone.history.handlers[0].route.source, '^test1$', 'Test1 route registered');
            ok(router.navigate('test1', {trigger:true, replace:true}), 'navigate to "test1"');

            // Route argument is RegExp, name and callback are undefined
            ok(router.authRoute(/^test2$/), 'Attempt to define authRoute with route argument as RegExp');
            strictEqual(Backbone.history.handlers[0].route.source, '^test2$', 'Test2 route registered');
            ok(router.navigate('test2', {trigger:true, replace:true}), 'navigate to "test2"');

            // Name is string, callback undefined
            ok(router.authRoute('test3', 'test3'), 'Attempt to define authRoute with name argument as string');
            ok(router.navigate('test3', {trigger:true, replace:true}), 'navigate to "test3"');
            ok(test3Called, 'test3 method found by name, and called');

            // Name is function, callback undefined
            ok(router.authRoute('test4', function () {
                test4Called = true;
            }), 'Attempt to define authRoute with name argument as function');
            ok(router.navigate('test4', {trigger:true, replace:true}), 'navigate to "test4"');
            ok(test4Called, 'test4 method found by name, and called');

            // All arguments set
            ok(router.authRoute('test5', 'test5', function () {
                test5Called = true;
            }), 'Attempt to define authRoute with name argument as function');
            ok(router.navigate('test5', {trigger:true, replace:true}), 'navigate to "test4"');
            ok(test5Called, 'test5 method found by name, and called');

            Auth.signedIn = false;
            start();
        });
    });

    asyncTest('authRoute', function ()  {
        var testSuite = this;
        require(['core/js/router', 'core/js/TopPatch/auth'], function(Router, Auth) {
            testSuite.initHistory();

            var AuthRouter = Router.extend({
                    routes: {
                        'login': $.noop
                    }
                }),
                router = new AuthRouter();
            ok(router.authRoute('restricted(/*subroute)', $.noop), 'Create "restricted" authRoute');

            Backbone.history.start({pushState: false});

            // Simulate user NOT signed in
            Auth.signedIn = false;
            ok(router.navigate('restricted/area', {trigger:true, replace:true}), 'navigate to "restricted" while NOT signed in');
            strictEqual(Backbone.history.fragment, 'login', 'Access denied. Redirected to login');
            strictEqual(Auth.attemptedRoute, 'restricted/area', 'Auth.attemptedRoute set correctly');

            // Simulate user signed in
            Auth.signedIn = true;
            ok(router.navigate('restricted', {trigger:true, replace:true}), 'navigate to "restricted" while signed in');
            strictEqual(Backbone.history.fragment, 'restricted', 'Access granted to restricted route');

            // Test clean up
            Auth.signedIn = false;
            start();
        });
    });

    asyncTest('authRoutes', function ()  {
        var testSuite = this;
        require(['core/js/router', 'core/js/TopPatch/auth'], function(Router, Auth) {
            testSuite.initHistory();

            var AuthRouter = Router.extend({
                    authRoutes: {
                        'restricted/area': $.noop
                    }
                }),
                router = new AuthRouter();

            Backbone.history.start({pushState: false});

            // Simulate user NOT signed in
            Auth.signedIn = false;
            ok(router.navigate('restricted/area', {trigger:true, replace:true}), 'navigate to "restricted" while NOT signed in');
            strictEqual(Backbone.history.fragment, 'login', 'Access denied. Redirected to login');
            strictEqual(Auth.attemptedRoute, 'restricted/area', 'Auth.attemptedRoute set correctly');

            // Simulate user signed in
            Auth.signedIn = true;
            ok(router.navigate('restricted', {trigger:true, replace:true}), 'navigate to "restricted" while signed in');
            strictEqual(Backbone.history.fragment, 'restricted', 'Access granted to restricted route');

            // Test clean up
            Auth.signedIn = false;
            start();
        });
    });
});
