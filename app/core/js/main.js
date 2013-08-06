define(['js/base_deps'], function() {
    "use strict";
    require(['js/dashboard_view'], function (Dashboard) {
        App.dashboard_view = new Dashboard();
        return App.dashboard_view.render().showLoading();
    });
});
