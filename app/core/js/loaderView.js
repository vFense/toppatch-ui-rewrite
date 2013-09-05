define(
    ['core/js/templateView', 'core/js/template/loading_indicator'],
    function (BaseView, template) {
        'use strict';
        return BaseView.extend({
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
