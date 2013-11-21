define(
    function (require) {
        'use strict';

        var TopPatch = require('./global');

        TopPatch.extend(
            require('./constants'),
            require('./auth')
        );

        return TopPatch;
    }
);
