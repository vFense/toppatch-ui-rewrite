define(
    ['core/js/views/template'],
    function (TemplateView) {
        'use strict';
        return TemplateView.extend({
            /**
             * A TemplateView that manages regions
             * @class Region
             * @extends TemplateView
             * @constructor
             * @returns {this}
             */
            constructor: function () {
                TemplateView.prototype.constructor.apply(this, arguments);
                if (_.isUndefined(this.regions)) {
                    this.regions = new Backbone.Model();
                }
                this.listenTo(this.regions, 'change', this.render);
                return this;
            },
            /**
             * Renders the layout of regions
             * @method render
             * @chainable
             */
            render: function (regions) {
                var that = this;
                TemplateView.prototype.render.apply(this, arguments);
                _.each(regions.attributes, function (view, region) {
                    that.$(region).html(view.$el || view);
                });
                return this;
            },
            /**
             * Get the properties that will be passed to the template
             * @method getData
             * @override
             * @returns {Object}
             */
            getData: function () {
                return this.regions.toJSON();
            }
        });
    }
);
