/**
 * base_templateView.js
 * ------------------------------------------------------------------------
 * A base_view that renders its template to $el
 *
 * Inspired by Backbone.Marionette.layout
 */
define(
    ['core/js/view'],
    function (BaseView) {
        'use strict';
        return BaseView.extend({
            render: function () {
                this.isClosed = false;
                if (_.isFunction(this.template)) {
                    var data = this.getData(),
                        html = this.template(data);
                    this.$el.html(html);
                } else {
                    var error;
                    if (_.isUndefined(this.template)) {
                        error = new Error('Template is undefined');
                        error.name = 'TemplateUndefined';
                    } else {
                        error = new TypeError('Expected template to be a function');
                        error.name = 'TemplateNotFunction';
                    }
                    throw error;
                }
                // Base view does not have a render method
                return this;
            },
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
