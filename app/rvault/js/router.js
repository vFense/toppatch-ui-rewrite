define(
    [
        'core/js/outletRouter',
        'core/js/views/outlet',
        'exports'
    ],
    function (Router, View, exports) {
        'use strict';
        var outletView = new View({
            className: 'container',

            // Sample template
            template: _.template('<header>Header</header><section id="main"></section><footer>Footer</footer>')
        });
        exports.Router = Router.extend({
            authRoutes: {
                'rvault(/)': 'root'
            },

            outlet: outletView,

            root: function () {
                this.show({$el: 'RVault'});
            }
        });
        exports.router = new exports.Router();
    }
);
