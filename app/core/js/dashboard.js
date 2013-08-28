define(
    [
        'core/js/template/dashboard_layout',
        'core/js/base_view',
        'bootstrap.collapse',
        'bootstrap.dropdown'
    ],
    function (template, baseView) {
        'use strict';
        var exports = {};
        exports.View = baseView.extend({
            el: '#dashboard',
            _template: template,
            render: function () {
                if (this.$el.html() === '') {
                    this.layout();
                }
                return this;
            },
            layout: function () {
                this.$el.html(this._template({
                    username: 'John Doe'
                }));
                return this;
            },
            setContentView: function (view) {
                var $target = this.$('#main');
                this.closeContentView();

                if (view instanceof Backbone.View) {
                    this._contentView = view;
                    this.registerChildView(this._contentView);
                    $target
                        .empty()
                        .html(this._contentView.render().delegateEvents().el);
                } else {
                    throw new TypeError('setContentView expects an instance of a Backbone.View');
                }

                return this;
            },
            closeContentView: function () {
                if (!_.isUndefined(this._contentView)) {
                    this.closeChildView(this._contentView);
                    this._contentView = undefined;
                }
                return this;
            }
        });

        return exports;
    }
);
