define(
    ['underscore', 'exports'],
    function (_, exports) {
        'use strict';
        var App = exports.App = {}
        _.extend(App, {
            rootElement: '#dashboard',
            show: function (view) {
                this.close();
                $(this.rootElement).html(view.$el);
                this.currentView = view;
                return this;
            },
            close: function () {
                if (this.currentView) {
                    this.currentView.close();
                }
                return this;
            }
        });
    }
);
