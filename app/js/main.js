define(['js/base_deps'], function() {
    "use strict";
    require(['js/dashboard_view'], function (Dashboard) {
        var $dash = new Dashboard();
        return $dash.render().showLoading();
    });
});
