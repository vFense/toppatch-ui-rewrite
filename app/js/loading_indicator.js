define(['backbone', 'text!templates/loading_indicator.html'], function (Backbone, template) {
    "use strict";
    var exports = {};
    exports.View = Backbone.View.extend({
        className: 'loading_indicator',
        _template: _.template(template),
        initialize: function () {
            this.render();
        },
        render: function () {
            if (!this.$spinner) {
                this.$spinner = this._template();
            }
            this.$el.html(this.$spinner);
            return this;
        },
        setLoadingText: function (text) {
            if (text) {
                this.$('[data-name="loading-text"]').html(text);
            } else {
                this.$('[data-name="loading-text"]').empty();
            }
        }
    });
    exports.spinner = function(text) {
        if (_.isUndefined(App.LoadingIndicator)) {
            App.LoadingIndicator = new exports.View();
            App.LoadingIndicator.setLoadingText(text);
        }
        return App.LoadingIndicator;
    };
    return exports;
});
