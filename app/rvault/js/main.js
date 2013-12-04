define(
    ['core/js/TopPatch/TopPatch', 'rvault/js/router'],
    function (TopPatch, Router) {
        'use strict';
        var RVault = TopPatch.modules.RVault = {};
        _.extend(RVault, Router);
        return RVault;
    }
);
