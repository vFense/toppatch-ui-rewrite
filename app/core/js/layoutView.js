/**
 * A TemplateView that is specialized in using the region manager
 *
 * Inspired by Backbone.Marionette.layout
 *
 * @class LayoutView
 * @extends TemplateView
 */
define(
    ['core/js/templateView', 'core/js/regionManager'],
    function (TemplateView, RegionManager) {
        'use strict';

        return TemplateView.extend({
            /**
             * Create an instance of LayoutView
             * @returns {this}
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
            },
            /**
             * Close all the regions, then reset each region
             * @returns {this}
             * @private
             */
            _reInitRegions: function () {
                this.regionManager
                    .closeRegions()
                    .each(function (region) {
                        region.reset();
                    });
                return this;
            },
            getRegion: function (name) {
                return this.regionManager.get(name);
            },
            addRegion: function (name, definition) {
                var region = {};
                region[name] = definition;
                return this.addRegions(region);
            },
            addRegions: function (regions) {
                this.regions = _.extend({}, this.regions, regions);
                return this._buildRegions(regions);
            },
            removeRegion: function (name) {
                delete this.regions[name];
                this.regionManager.removeRegion(name);
                return this;
            },
            _buildRegions: function (regions) {
                var that = this,
                    defaults = {
                        parentEl: function () { return that.$el; }
                    };

                this.regionManager.addRegions(regions, defaults);

                return this;
            },
            render: function () {
                if (this.isClosed === true) {
                    this._initRegions();
                }
                if (this._firstRender) {
                    this._firstRender = false;
                } else {
                    this._reInitRegions();
                }
                TemplateView.prototype.render.apply(this, arguments);
                return this;
            },
            close: function () {
                if (!this.isClosed) {
                    this.regionManager.close();
                    TemplateView.prototype.close.apply(this, arguments);
                }
                return this;
            }
        });
    }
);
