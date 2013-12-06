define(
    ['core/js/views/template', 'core/template/loading_indicator'],
    function (TemplateView, template) {
        'use strict';
        return TemplateView.extend({
            className: 'loading_indicator',
            template: template,
            setLoadingText: function (text) {
                this.$('[data-name="text"]').text(text);
                return this;
            },
            getLoadingText: function () {
                return this.$('[data-name="text"]').text();
            }
        });
    }
);
