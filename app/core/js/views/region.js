/**
 * A TemplateView that creates regions
 * @class Region
 * @extends TemplateView
 */
define(
    ['core/js/views/template'],
    function (TemplateView) {
        'use strict';
        return TemplateView.extend({
            constructor: function () {
                this.model = new Backbone.Model();
                this.listenTo(this.model, 'change', this.render);
            },
            render: function (model) {
                TemplateView.prototype.render.apply(this, arguments);
                _.each(model.attributes, function (view, region) {
                    this.$(region).html(view.$el || view);
                });
            }
        });
    }
);
