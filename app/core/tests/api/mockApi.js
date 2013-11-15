define(
    ['jquery.mockjax'],
    function (mockjax) {
        'use strict';
        return {
            id: null,
            clear: function () {
                $.mockjaxClear(this.id);
            },
            clearAll: function () {
                $.mockjaxClear();
            }
        };
    }
);