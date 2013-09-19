/**
 * A View that renders its template to $el
 *
 * @class TemplateView
 * @extends View
 */
define(
    ['core/js/view'],
    function (BaseView) {
        'use strict';
        return BaseView.extend({
            /**
             * A handlebars, or underscore, template method to render with.
             * If this property is not set when render is executed, render
             * will throw an exception.
             * @attribute template
             * @type Function
             * @default undefined
             * @protected
             */
            template: undefined,

            /**
             * Render the result of this.getData() via this.template
             * @method render
             * @chainable
             */
            render: function () {
                this.isClosed = false;
                if (_.isFunction(this.template)) {
                    var data = this.getData(),
                        html = this.template(data);
                    this.$el.html(html);
                } else {
                    var error = new TypeError('Template is not a function');
                    error.name = 'TemplateNotFunction';
                    throw error;
                }
                // Base view does not have a render method
                return this;
            },

            /**
             * Get this.model, or this.collection, converted to JSON.
             * If this.model and this.collection exist at the same time,
             * this.model will be returned. Override this method if you
             * want a different behaviour.
             * @method getData
             * @returns {Object} JSON representation of this.model, or this.collection
             */
            getData: function () {
                var data = {};
                if (this.model instanceof Backbone.Model) {
                    data = this.model.toJSON();
                } else if (this.collection instanceof Backbone.Collection) {
                    data.items = this.collection.toJSON();
                }
                return data;
            }
        });
    }
);
