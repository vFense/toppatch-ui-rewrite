define(
    ['core/js/templateView', 'core/js/regionManager'],
    function (TemplateView, RegionManager) {
        'use strict';

        return TemplateView.extend({
            /**
             * A TemplateView that is specialized in using the region manager
             *
             * Inspired by Backbone.Marionette.layout
             * @class LayoutView
             * @extends TemplateView
             * @constructor
             * @returns {this}
             */
            constructor: function () {
                this._initRegions();
                this._firstRender = true;
                TemplateView.prototype.constructor.apply(this, arguments);
                return this;
            },
            /**
             * @attribute regions
             * @type Object
             * @default undefined
             */
            regions: undefined,
            /**
             * Handle the state of the regions, then render the view itself
             * @method render
             * @chainable
             * @returns {this}
             */
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
            /**
             * Close all the regions, then close the view itself.
             * @method close
             * @chainable
             * @returns {this}
             */
            close: function () {
                if (!this.isClosed) {
                    this.regionManager.close();
                    TemplateView.prototype.close.apply(this, arguments);
                }
                return this;
            },
            /**
             * Initialize the regions defined in this.regions
             * @method _initRegions
             * @chainable
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
             * Re-Initialize the regions by closing and resetting them
             * @method _reInitRegions
             * @chainable
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
            /**
             * Get a region by name
             * @method getRegion
             * @param name
             * @example view.getRegion('header');
             * @chainable
             * @returns {this}
             */
            getRegion: function (name) {
                return this.regionManager.get(name);
            },
            /**
             * Add a region by name
             * @method addRegion
             * @param name
             * @param definition
             * @example view.addRegion('header', '#header');
             * @chainable
             * @returns {this}
             */
            addRegion: function (name, definition) {
                var region = {};
                region[name] = definition;
                return this.addRegions(region);
            },
            /**
             * Add many regions
             * @method addRegions
             * @param regions {object} Definitions of regions
             * @example view.addRegions({name: def1, name2: def2});
             * @chainable
             * @returns {this}
             */
            addRegions: function (regions) {
                this.regions = _.extend({}, this.regions, regions);
                return this._buildRegions(regions);
            },
            /**
             * Remove a region by name
             * @method removeRegion
             * @param name
             * @chainable
             * @returns {this}
             */
            removeRegion: function (name) {
                delete this.regions[name];
                this.regionManager.removeRegion(name);
                return this;
            },
            /**
             * Adds regions to this.regionManager with this.$el as the parent context.
             * This allows the regions to find the correct element to render into.
             * @method _buildRegions
             * @param regions
             * @chainable
             * @returns {this}
             * @private
             */
            _buildRegions: function (regions) {
                var that = this,
                    defaults = {
                        parentEl: function () { return that.$el; }
                    };

                this.regionManager.addRegions(regions, defaults);

                return this;
            }
        });
    }
);
