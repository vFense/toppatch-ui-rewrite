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
            },
            /**
             * Sets up the region manager and populates it from this.regions
             * @returns {this}
             * @private
             */
            _initRegions: function () {
                this.regionManager = new RegionManager();
                var regions = _.result(this, 'regions');
                if (!_.isUndefined(regions)) {
                    this.addRegions(_.result(this, 'regions'));
                }
                return this;
            }
        });
    }
);
