define(
    function (require) {
        'use strict';
        return require('core/js/routes/_outletRouter').extend({
            authRoutes: {
                'rvault(/)': require('./index')
            },

            outlet: new (require('core/js/views/outlet'))({
                className: 'container',

                // Sample template
                template: _.template('<header>Header</header><section id="main"></section><footer>Footer</footer>')
            })
        });
    }
);
