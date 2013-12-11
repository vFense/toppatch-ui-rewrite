define(
    function (require) {
        'use strict';
        var View = require('core/js/views/invalid');
        return function () {
            console.log(arguments);
            var view = new View();
            this.show(view.render());
            return this;
        };
    }
);
