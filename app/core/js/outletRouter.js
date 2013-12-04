define(
    ['core/js/router'],
    function (Router) {
        'use strict';
        return Router.extend({
            outlet: null,
            show: function (view) {
                this.outlet.show(view);
                if (TopPatch.currentView !== this.outlet) {
                    TopPatch.show(this.outlet);
                }
                return this;
            },
        });
    }
);
