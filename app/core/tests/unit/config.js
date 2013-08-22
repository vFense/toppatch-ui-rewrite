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

        $.each(shims, function(shim, shimProps) {
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
        /**
         * Previous versions of this test had race condition in which two versions of
         * bootstrap.tooltip was loading at the same time. If the version called by
         * bootstrap.popover was not loaded first, bootstrap.popover would throw
         * an uncaught exception.
         *
         * This version gets around this by waiting for each require call to complete
         * before calling the next require call.
         */
        var paths = _.keys(window.requirejsPaths),
            pathCount = paths.length,
            pathTester,
            nextPath,
            i = 0;

        nextPath = function () {
            if (i < pathCount) {
                pathTester(paths[i += 1], nextPath);
            } else {
                start();
            }
        };

        pathTester = function(path) {
            require(
                [path],
                function () {
                    ok(true, path);
                    nextPath();
                },
                function (error) {
                    ok(false, [path, '-', error.message].join(' '));
                    nextPath();
                }
            );
        };

        nextPath();
    });
});
