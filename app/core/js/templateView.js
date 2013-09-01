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
