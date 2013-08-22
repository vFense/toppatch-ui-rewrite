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

    // Warning: The following test uses recursion
    asyncTest('Attempt to require all paths', function () {
        var paths = _.keys(window.requirejsPaths),
            pathCount = paths.length,
            pathTester,
            nextPath,
            i = 0;

        expect(pathCount);

        // We are creating a loop that is manually stepped
        // Each call to nextPath goes to the next step
        // Each step will call pathTester, unless we are
        // at the end of the paths array
        nextPath = function () {
            if (i < pathCount) {
                pathTester(paths[i += 1], nextPath);
            } else {
                start();
            }
        };

        // Test the given path, and call nextPath onLoad, or onLoadError
        pathTester = function(path) {
            require(
                [path],
                function () {
                    // Path loaded successfully
                    ok(true, path);
                    nextPath();
                },
                function (error) {
                    // Path failed to load
                    ok(false, [path, '-', error.message].join(' '));
                    nextPath();
                }
            );
        };

        // Start the first path test
        nextPath();
    });
});
