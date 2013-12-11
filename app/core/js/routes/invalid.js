define(
    function (require) {
        'use strict';
        var View = require('core/js/views/invalid');
        return function () {
            var view = new View();
            this.show(view.render());
            return this;
        };
    }
);
