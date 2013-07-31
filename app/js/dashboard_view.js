define(
    [
        'js/loading_indicator',
        'text!templates/dashboard_layout.html',
        'bootstrap.collapse',
        'bootstrap.dropdown'
    ],
    function (loading_indicator, template) {
        "use strict";
        return Backbone.View.extend({
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
                this.$contentArea = this.$('>#main');
                return this;
            },
            showLoading: function () {
                this.loadingIndicator = loading_indicator.spinner();
                return this.$('>#main').html(this.loadingIndicator.el);
            }
        });
    }
);
