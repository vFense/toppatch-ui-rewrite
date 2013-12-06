define(
    //[],
    function (require) {
        'use strict';
        var Outlet = require('core/js/views/outlet');
        var Router = require('core/js/routes/_outletRouter').extend({
            routes: {
                // Core Routes
                '':                 require('./index'),
                'login':            require('./login'),
                'logout':           require('./logout'),
                'forgotPassword':   $.noop,
                '*path':            require('./invalid')
            },

            outlet: new Outlet()
        });

        return Router;
    }
);
