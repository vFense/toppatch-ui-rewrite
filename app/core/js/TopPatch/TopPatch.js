define(
    function (require) {
        'use strict';

        var TopPatch = require('core/js/TopPatch/global');

        TopPatch.extend(
            require('core/js/TopPatch/constants'),
            require('core/js/TopPatch/app'),
            {
                Auth: require('core/js/TopPatch/auth')
            }
        );

        return TopPatch;
    }
);
