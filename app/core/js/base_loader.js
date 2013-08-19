define(
    ['core/js/base_view', 'text!core/templates/loading_indicator.html'],
    function (BaseView, template) {
        'use strict';
        return BaseView.extend({
            className: 'loading_indicator',
            _template: _.template(template),
            render: function () {
                if (!this.$spinner) { this.$spinner = this._template(); }
                this.$el.html(this.$spinner);
                return this;
            },
            setLoadingText: function (text) {
                this.$('[data-name"text"]').text(text);
                return this;
            },
            getLoadingText: function () {
                return this.$('[data-name"text"]').text();
            }
        });
    }
);
