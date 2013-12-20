define(
    function (require) {
        'use strict';

        var _ = require('underscore'),
            Application = require('core/js/TopPatch/app'),
            TopPatch = window.TopPatch = new Application();

        _.extend(
            TopPatch,
            require('core/js/TopPatch/constants'),
            {
                Auth: require('core/js/TopPatch/auth')
            }
        );

        return TopPatch;
    }
);
