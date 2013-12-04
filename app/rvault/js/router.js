define(
    ['core/js/router', 'exports'],
    function (Router, exports) {
        'use strict';
        exports.Router = Router.extend({
            authRoutes: {
                'rvault(/)': 'root'
            },
            root: function () {
                window.console.log('rvault');
            }
        });
        exports.router = new exports.Router();
    }
);
