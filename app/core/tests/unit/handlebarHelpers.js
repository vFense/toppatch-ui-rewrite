$(document).ready(function () {
    'use strict';
    module('handlebarHelpers');

    asyncTest('Compare', function () {
        require(
            ['core/js/handlebarHelpers'],
            function (Handlebars) {
                var registered = _.has(Handlebars.helpers, 'compare'),
                    options = {
                        fn: function () { return true; },
                        inverse: function () { return false; }
                    },
                    compare;
                ok(registered, 'Compare helper is registered');

                if(registered) {
                    compare = Handlebars.helpers.compare;

                    throws(function () {
                        compare();
                    }, Error, 'Less than 3 arguments threw an error');

                    throws(function () {
                        compare(1, '/', 1, options);
                    }, Error, 'Unknown comparison type');

                    // Operation default (===)
                    strictEqual(compare(1, 1, options), true, 'compare 1 1 is true');
                    strictEqual(compare(1, '1', options), false, 'compare 1 "1" is false');
                    strictEqual(compare(1, true, options), false, 'compare 1 true is false');
                    strictEqual(compare(1, 0, options), false, 'compare 1 0 is false');

                    // Operation ==
                    strictEqual(compare(1, '==', 1, options), true, '1 == 1 is true');
                    strictEqual(compare(1, '==', '1', options), true, '1 == "1" is true');
                    strictEqual(compare(1, '==', true, options), true, '1 == true is true');
                    strictEqual(compare(1, '==', 0, options), false, '1 == 0 is false');

                    // Operation !=
                    strictEqual(compare(1, '!=', 1, options), false, '1 == 1 is false');
                    strictEqual(compare(1, '!=', '1', options), false, '1 == "1" is false');
                    strictEqual(compare(1, '!=', true, options), false, '1 == true is false');
                    strictEqual(compare(1, '!=', 0, options), true, '1 == 0 is true');

                    // Operation ===
                    strictEqual(compare(1, '===', 1, options), true, '1 === 1 is true');
                    strictEqual(compare(1, '===', '1', options), false, '1 === "1" is false');
                    strictEqual(compare(1, '===', true, options), false, '1 === true is false');
                    strictEqual(compare(1, '===', 0, options), false, '1 === 0 is false');

                    // Operation !==
                    strictEqual(compare(1, '!==', 1, options), false, '1 == 1 is false');
                    strictEqual(compare(1, '!==', '1', options), true, '1 == "1" is true');
                    strictEqual(compare(1, '!==', true, options), true, '1 == true is true');
                    strictEqual(compare(1, '!==', 0, options), true, '1 == 0 is true');

                    // Operation <
                    strictEqual(compare(1, '<', 1, options), false, '1 < 1 is false');
                    strictEqual(compare(1, '<', 2, options), true, '1 < 2 is true');
                    strictEqual(compare(2, '<', 1, options), false, '2 < 1 is false');

                    // Operation <=
                    strictEqual(compare(1, '<=', 1, options), true, '1 <= 1 is true');
                    strictEqual(compare(1, '<=', 2, options), true, '1 <= 2 is true');
                    strictEqual(compare(2, '<=', 1, options), false, '2 <= 1 is false');

                    // Operation >
                    strictEqual(compare(1, '>', 1, options), false, '1 > 1 is false');
                    strictEqual(compare(1, '>', 2, options), false, '1 > 2 is false');
                    strictEqual(compare(2, '>', 1, options), true, '2 > 1 is true');

                    // Operation >=
                    strictEqual(compare(1, '>=', 1, options), true, '1 > 1 is true');
                    strictEqual(compare(1, '>=', 2, options), false, '1 > 2 is false');
                    strictEqual(compare(2, '>=', 1, options), true, '2 > 1 is true');

                    strictEqual(compare(1, 'typeof', 'number', options), true, 'typeof 1 is number');
                    strictEqual(compare(1, 'typeof', 'string', options), false, 'typeof 1 is not string');
                }

                start();
            }
        );
    });
});
