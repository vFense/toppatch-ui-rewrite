define(
    function () {
        'use strict';
        return function () {
            return this.navigate(TopPatch.defaultRoute, {trigger: true, replace: true});
        };
    }
);
