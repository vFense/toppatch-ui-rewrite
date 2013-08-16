$(document).ready(function () {
    'use strict';

    // The following code was adapted from Backbone's router unit test logic
    var Location = function(href) {
            this.replace(href);
        },
        location = null;

    _.extend(Location.prototype, {
        replace: function(href) {
            _.extend(this, _.pick($('<a></a>', {href: href})[0],
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

    module('base_router', {
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
    asyncTest('Test navigate override', function () {
        var testSuite = this;
        require(['base_router'], function(Router) {
            testSuite.initHistory();
            var router = new Router(),
                count = 0;

            // Override function so we can see if it gets called
            router.updateFragments = function () {
                count += 1;
            };

            Backbone.history.start({pushState: false});
            router.navigate('');
            strictEqual(updatedFragments, 1, 'router.navigate called updateFragments');

            start();
        });
    });

    asyncTest('Test route override', function () {
        var testSuite = this;
        require(['base_router'], function(Router) {
            testSuite.initHistory();
            var router = new Router(),
                count = 0;

            // Override function so we can see if it gets called
            router.updateFragments = function () {
                count += 1;
            };

            Backbone.history.start({pushState: false});

            // Create new route(route) --------------------------------
            router.pages = $.noop;
            router.route('test1');

            testSuite.newLocation('http://example.com/#test1');

            strictEqual(count, 1, 'Navigation to new route called updateFragments');

            // Create new route(route, name) --------------------------
            router.route('test2', 'test2');

            testSuite.newLocation('http://example.com/#test2');

            strictEqual(count, 2,'Navigation to new route called updateFragments');

            // Create new route(route, callback) ----------------------
            router.route('test3', $.noop);

            testSuite.newLocation('http://example.com/#test3');

            strictEqual(count, 3,'Navigation to new route called updateFragments');

            // Create new route(route, name, callback) ----------------
            router.route("test4/", "test4", $.noop);

            testSuite.newLocation('http://example.com/#test4');

            strictEqual(count, 4, 'Navigation to new route called updateFragments');

            start();
        });
    });
});
