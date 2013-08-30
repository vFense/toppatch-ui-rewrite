/*globals libs */
$(document).ready(function () {
    'use strict';
    module('require.config');
    test('Every shim needs an associated path', function() {
        var paths = window.requirejsPaths,
            shims = window.requirejsShims;

        $.each(shims, function(shim) {
            notStrictEqual(typeof paths[shim], 'undefined', shim);
        });
    });
    test('Every shim dependency needs an associated path', function () {
        var paths = window.requirejsPaths,
            shims = window.requirejsShims;

        libs._.each(shims, function(shimProps, shim) {
            if (typeof shimProps.deps !== 'undefined') {
                var pass = true;
                $.each(shimProps.deps, function(index, dependency) {
                    if (typeof paths[dependency] === 'undefined') {
                        ok(false, [shim, ' - Dependency "', dependency, '" is undefined'].join(''));
                        pass = pass && false;
                    }
                });
                if (pass) {
                    ok(pass, [shim, 'has undefined dependency paths'].join(' '));
                }
            }
        });
    });

    asyncTest('Attempt to require all paths', function () {
        // Use Backbone.Events to get around recursion
        var vent = libs._.extend({}, libs.Backbone.Events),
            paths = libs._.keys(window.requirejsPaths),
            pathCount = paths.length,
            nextPath,
            pathTest,
            i = 0;

        expect(pathCount);

        // We are creating a loop that is manually stepped
        // Each call to nextPath goes to the next step
        // Each step will call pathTester, unless we are
        // at the end of the paths array
        nextPath = function () {
            if (i < pathCount) {
                vent.trigger('pathTest', paths[i]);
                i += 1;
            } else {
                start();
            }
        };

        // Test the given path, and call nextPath onLoad, or onLoadError
        pathTest = function(path) {
            require(
                [path],
                function () {
                    // Path loaded successfully
                    ok(true, path);
                    vent.trigger('nextPath');
                },
                function (error) {
                    // Path failed to load
                    ok(false, [path, '-', error.message].join(' '));
                    vent.trigger('nextPath');
                }
            );
        };

        vent.on('nextPath', nextPath);
        vent.on('pathTest', pathTest);

        // Start the first path test
        vent.trigger('nextPath');
    });
});
