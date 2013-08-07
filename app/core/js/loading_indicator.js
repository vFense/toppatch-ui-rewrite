define(
    ['text!core/templates/loading_indicator.html', 'backbone'],
    function (template) {
        "use strict";
        return Backbone.View.extend({
            className: 'loading_indicator',
            _template: _.template(template),
            initialize: function () { this.render(); },
            render: function () {
                if (!this.$spinner) { this.$spinner = this._template(); }
                this.$el.html(this.$spinner);
                return this;
            },
            setLoadingText: function (text) {
                var $element = this.$('[data-name="loading-text"]');
                if (text) {
                    $element.html(text);
                } else {
                    $element.empty();
                }
            }
        });
    }
);
