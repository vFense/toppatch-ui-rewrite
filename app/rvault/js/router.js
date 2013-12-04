define(
    [
        'core/js/outletRouter',
        'core/js/outletView',
        'exports'
    ],
    function (Router, View, exports) {
        'use strict';
        var outletView = new View();
        exports.Router = Router.extend({
            authRoutes: {
                'rvault(/)': 'root'
            },

            outlet: outletView,

            root: function () {
                this.show({$el: '<h1>RVault</h1>'});
            }
        });
        exports.router = new exports.Router();
    }
);
