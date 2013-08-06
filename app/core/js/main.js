define(['core/js/base_deps'], function() {
    "use strict";
    require(['core/js/dashboard'], function (Dashboard) {
        App.dashboardView = new Dashboard();
        return App.dashboardView.render().showLoading();
    });
});
