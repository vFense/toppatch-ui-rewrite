define(
    ['underscore', 'exports'],
    function (_, exports) {
        'use strict';
        _.extend(exports, {
            COOKIE: {
                AUTH: 'user'
            },
            KEYS: {
                ENTER: 13,
                ESCAPE: 27
            },
            // time in ms to throttle between key presses for search
            THROTTLE: 400,
        });
    }
);
