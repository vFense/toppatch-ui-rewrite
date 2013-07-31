define(function() {
    "use strict";
    require(['js/base_deps']);
    require(['js/dashboard_view'], function (Dashboard) {
        var $dash = new Dashboard();
        return $dash.render().showLoading();
    });
});
