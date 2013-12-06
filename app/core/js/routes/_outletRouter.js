define(
    ['core/js/routes/_router'],
    function (Router) {
        'use strict';
        return Router.extend({
            outlet: null,
            show: function (view) {
                this.outlet.show(view);
                if (TopPatch.App.currentView !== this.outlet) {
                    TopPatch.App.show(this.outlet);
                }
                return this;
            },
        });
    }
);
