define(
    function (require) {
        'use strict';

        var TopPatch = require('./global');

        TopPatch.extend(
            require('./constants'),
            require('./utils'),
            require('./auth')
        );

        return TopPatch;
    }
);
