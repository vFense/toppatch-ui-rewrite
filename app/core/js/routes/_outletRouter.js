define(
    ['core/js/routes/_router'],
    function (Router) {
        'use strict';
        return Router.extend({
            outlet: null,
            show: function (view) {
                TopPatch.show(
                    this.outlet.show(view)
                );
                return this;
            }
        });
    }
);
