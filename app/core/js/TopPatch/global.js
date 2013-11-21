define(
    function (require) {
        'use strict';
        var _TopPatch = window.TopPatch,
            TopPatch = window.TopPatch = {};

        /**
         * Relinquish TopPatch's control of the `window.TopPatch` variable.
         * @method noConflict
         * @returns TopPatch
         */
        TopPatch.noConflict = function () {
            if (window.TopPatch === TopPatch) {
                window.TopPatch = _TopPatch;
            }
            return TopPatch;
        };

        TopPatch.extend = function () {
            var args = _.toArray(arguments);
            args.unshift(TopPatch);
            return _.extend.apply(_, args);
        };

        return TopPatch;
    }
);
