define(
    ['core/js/TopPatch/TopPatch', 'rvault/js/routes/router'],
    function (TopPatch, Router) {
        'use strict';
        var RVault = TopPatch.modules.RVault = {};
        _.extend(RVault, Router);
        return RVault;
    }
);
