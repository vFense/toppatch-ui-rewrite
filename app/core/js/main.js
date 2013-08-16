define(['core/js/base_deps'], function() {
    'use strict';
    require(['core/js/dashboard'], function (dashboard) {
        GLOBALS.App.dashboardView = new dashboard.View();
        return GLOBALS.App.dashboardView.render();
    });
});
