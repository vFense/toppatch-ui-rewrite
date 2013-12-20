define(
    function (require) {
        'use strict';
        return require('core/js/routes/_outletRouter').extend({
            authRoutes: {
                'rvault(/)': require('./index'),
                'rvault/agents(/)': require('./index'),
                'rvault/applications(/)': require('./index'),
                'rvault/schedules(/)': require('./index'),
                'rvault/operations(/)': require('./index')
            },

            outlet: new (require('rvault/js/views/outlet'))()
        });
    }
);
