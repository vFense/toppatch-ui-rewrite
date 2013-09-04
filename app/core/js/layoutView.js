/**
 * base_layoutView.js
 * ------------------------------------------------------------------------
 * A base_templateView that is specialized to use the region manager
 *
 * Inspired by Backbone.Marionette.layout
 */
define(
    ['core/js/templateView', 'core/js/regionManager'],
    function (TemplateView, RegionManager) {
        'use strict';

        return TemplateView.extend({
            /**
             * Create an instance of LayoutView
             * @returns {*}
             */
            constructor: function () {
                this._initRegions();
                this._firstRender = true;
                TemplateView.prototype.constructor.apply(this, arguments);
                return this;
            }
        });
    }
);
