define(
    [
        'core/js/views/outlet',
        'rvault/template/outlet',
        'rvault/template/_header',
        'rvault/template/_footer',
        'bootstrap.collapse',
        'bootstrap.dropdown'
    ],
    function (Outlet, template) {
        'use strict';
        return Outlet.extend({
            template: template,
            getData: function () {
                return {
                    username: TopPatch.Auth.user.get('username')
                };
            }
        });
    }
);
