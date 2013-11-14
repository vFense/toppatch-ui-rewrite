/**
 * Global object containing constants and other variables
 * @class TopPatch
 * @static
 */
define(
    function (require) {
        'use strict';
        var _TopPatch = window.TopPatch, TopPatch;

        TopPatch = _.extend({},
            require('./constants'),
            require('./auth'),
            {
                /**
                 * Relinquish TopPatch's control of the `window.TopPatch` variable.
                 * @method noConflict
                 * @returns TopPatch
                 */
                noConflict: function () {
                    if (window.TopPatch === TopPatch) {
                        window.TopPatch = _TopPatch;
                    }
                    return TopPatch;
                }
            }
        );

        window.TopPatch = TopPatch;

        return TopPatch;
    }
);
