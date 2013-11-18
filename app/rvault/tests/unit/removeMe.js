$(document).ready(function () {
    'use strict';
    module('Placeholder');

    asyncTest('Remove me', function () {
        require(
            ['rvault/js/removeMe'],
            function (test) {
                strictEqual(test, 42, 'PLaceholder test has passed');

                start();
            }
        );
    });
});
