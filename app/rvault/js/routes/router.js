define(
    function (require) {
        'use strict';
        return require('core/js/routes/_outletRouter').extend({
            authRoutes: {
                'rvault(/)': require('./index')
            },

            outlet: new (require('rvault/js/views/outlet'))()
        });
    }
);
