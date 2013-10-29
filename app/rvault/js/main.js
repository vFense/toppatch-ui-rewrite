define(function() {
    'use strict';
    require(['core/js/dashboard'], function (dashboard) {
        var dashboardView = new dashboard.View();
        return dashboardView.render();
    });
});
