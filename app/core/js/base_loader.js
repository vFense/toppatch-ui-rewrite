define(
    ['text!core/templates/loading_indicator.html', 'base_view'],
    function (template) {
        'use strict';
        return require('base_view').extend({
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
