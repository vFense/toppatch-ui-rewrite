define(
    [
        'core/js/routes/_outletRouter',
        'core/js/views/outlet'
    ],
    function (Router, View) {
        'use strict';
        var outletView = new View({
            className: 'container',

            // Sample template
            template: _.template('<header>Header</header><section id="main"></section><footer>Footer</footer>')
        });
        return Router.extend({
            authRoutes: {
                'rvault(/)': 'root'
            },

            outlet: outletView,

            root: function () {
                this.show({$el: 'RVault'});
            }
        });
    }
);
