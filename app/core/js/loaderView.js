define(
    ['core/js/view', 'core/js/template/loading_indicator'],
    function (BaseView, template) {
        'use strict';
        return BaseView.extend({
            className: 'loading_indicator',
            template: template,
            render: function () {
                this.$el.html(this.template());
                return this;
            },
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
