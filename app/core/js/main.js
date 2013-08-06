define(['core/js/base_deps'], function() {
    "use strict";
    require(['core/js/dashboard'], function (Dashboard) {
        App.dashboard_view = new Dashboard();
        return App.dashboard_view.render().showLoading();
    });
});
