define(
    function (require) {
        'use strict';
        var View = require('core/js/views/login');
        return function () {
            // No need to show login page if already logged in
            if (TopPatch.Auth.signedIn === true) {
                return this.navigate('', {trigger:true, replace: true});
            }
            var view = new View();
            this.show(view.render());
            return this;
        };
    }
);
