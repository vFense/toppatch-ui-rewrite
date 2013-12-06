define(
    function (require) {
        'use strict';

        var TopPatch = require('core/js/TopPatch/global');

        TopPatch.extend(
            require('core/js/TopPatch/constants'),
            require('core/js/TopPatch/app'),
            require('core/js/TopPatch/utils'),
            {
                Auth: require('core/js/TopPatch/auth'),
                Router: require('core/js/routes/router')
            }
        );

        return TopPatch;
    }
);
