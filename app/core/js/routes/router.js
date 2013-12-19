define(
    function (require) {
        'use strict';
        var Outlet = require('core/js/views/outlet');
        return require('core/js/routes/_outletRouter').extend({
            routes: {
                '':                 require('./index'),
                'login':            require('./login'),
                'logout':           require('./logout'),
                'forgotPassword':   $.noop,
                '*path':            require('./invalid')
            },

            outlet: new Outlet()
        });
    }
);
