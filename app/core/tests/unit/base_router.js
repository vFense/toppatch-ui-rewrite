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

    module('BaseRouter', {
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
        require(['core/js/base_router'], function(Router) {
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
            router.navigate('test1');
            strictEqual(router.currentFragment, 'test1', 'Current fragment is "test1"');
            strictEqual(router.lastFragment, '', 'Last fragment is ""');

            // Navigate to #test2
            router.navigate('test2');
            strictEqual(router.currentFragment, 'test1', 'Current fragment is "test2"');
            strictEqual(router.lastFragment, '', 'Last fragment is "test1"');

            start();
        });
    });
});
