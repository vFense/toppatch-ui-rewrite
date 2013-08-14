define(
    [
        'text!core/templates/dashboard_layout.html',
        'base_view',
        'bootstrap.collapse',
        'bootstrap.dropdown'
    ],
    function (template, base_view) {
        "use strict";
        var exports = {};
        exports.View = base_view.extend({
            el: '#dashboard',
            _template: _.template(template),
            setContentView: function (view) {
                var that = this,
                    $target = this.$('#main');
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
            },
            render: function () {
                if (this.$el.html() === "") {
                    this.layout();
                }
                return this;
            },
            layout: function () {
                this.$el.html(this._template({
                    username: 'John Doe'
                }));
                return this;
            }
        });

        return exports;
    }
);
