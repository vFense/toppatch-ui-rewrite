define(
    function (require) {
        'use strict';
        var Outlet = require('rvault/js/views/outlet');
        return require('core/js/routes/_outletRouter').extend({
            authRoutes: {
                'rvault(/)': require('./index'),
                'rvault/agents(/)': require('./agents/index'),
                'rvault/applications(/)': require('./applications/index'),
                'rvault/schedules(/)': require('./schedules/index'),
                'rvault/operations(/)': require('./operations/index')
            },

            outlet: new Outlet()
        });
    }
);
