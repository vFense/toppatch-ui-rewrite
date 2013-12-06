define(
    function (require) {
        'use strict';
        var outletView = new (require('core/js/views/outlet'))({
            className: 'container',

            // Sample template
            template: _.template('<header>Header</header><section id="main"></section><footer>Footer</footer>')
        });
        return require('core/js/routes/_outletRouter').extend({
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
