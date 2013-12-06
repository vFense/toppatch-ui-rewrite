define(
    function () {
        'use strict';
        return function () {
            this.show({$el: '<h3>Something went wrong</h3>'});
            return this;
        };
    }
);
