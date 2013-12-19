define(
    function (require) {
        'use strict';
        var Outlet = require('rvault/js/views/outlet');
        return require('core/js/routes/_outletRouter').extend({
            authRoutes: {
                'rvault(/)': require('./index')
            },

            outlet: new Outlet()
        });
    }
);
