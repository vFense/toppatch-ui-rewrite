$(document).ready(function () {
    "use strict";
    module('require.config');
    test("Test RequireJS paths and shims", function () {
        stop();
        require(['text'], function () {
            var paths = requirejs_paths;
            $.each(paths, function (key) {
                stop();
                require(
                    [key],
                    function (input) {
                        ok(true, [key + ' -> ', key, '.js'].join(''));
                        start();
                    },
                    function (err) { ok(false, err); start(); }
                );
            });
            start();
        });
    });

    start();
});
