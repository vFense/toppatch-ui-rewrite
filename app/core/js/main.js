define(['core/js/base_deps'], function() {
    "use strict";
    require(['core/js/dashboard'], function (dashboard) {
        App.dashboardView = new dashboard.View();
        return App.dashboardView.render().showLoading();
    });
});
