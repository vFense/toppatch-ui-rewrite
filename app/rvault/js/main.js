define(function() {
    'use strict';
    require(['rvault/js/dashboard'], function (dashboard) {
        var dashboardView = new dashboard.View();
        return dashboardView.render();
    });
});
