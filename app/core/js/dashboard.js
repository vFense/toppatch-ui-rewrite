define(
    [
        'text!core/templates/dashboard_layout.html',
        'bootstrap.collapse',
        'bootstrap.dropdown'
    ],
    function (template) {
        "use strict";
        var exports = {};
        exports.View = Backbone.View.extend({
            el: '#dashboard',
            _template: _.template(template),
            setContentView: function (view) {
                var that = this,
                    $content = this.$('>#main');
                this.closeContentView();

                if (view instanceof Backbone.View) {
                    this._contentView = view;
                    $content
                        .empty()
                        .html(this._contentView.render().delegateEvents().el);
                } else {
                    throw new TypeError('setContentView expects an instance of a Backbone.View');
                }

                return this;
            },
            closeContentView: function () {
                if (!_.isUndefined(this._contentView)) {
                    this._contentView.close();
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
            },
            showLoading: function () {
                this.setContentView(_.result(this, 'getLoadingIndicator'));
            },
            hideLoading: function () {
                if (_.result(this, 'getLoadingIndicator') === this._contentView) {
                    this.closeContentView();
                }
            }
        });

        return exports;
    }
);
