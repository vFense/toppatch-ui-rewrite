/**
 * base_regionManager.js
 * ------------------------------------------------------------------------
 * Manage multiple Regions from one location
 *
 * Inspired by Backbone.Marionette.regionManager
 */
define(
    ['core/js/base_region'],
    function () {
        'use strict';
        var Region = require('core/js/base_region');
        /**
         * Creates an instance of RegionManager
         * @returns {this}
         * @constructor
         */
        var RegionManager = function () {
            this._regions = {};
            this.length = 0;
            return this;
        };

        _.extend(RegionManager.prototype, {
            /**
             * Set the this.length
             * @returns {this}
             * @private
             */
            _setLength: function () {
                this.length = _.size(this._regions);
                return this;
            },

            /**
             * Add the region to the _regions object at the named key
             * Update the cached _regions length
             * @param name
             * @param region
             * @returns {this}
             * @private
             */
            _store: function (name, region) {
                this._regions[name] = region;
                this._setLength();
                return this;
            },

            /**
             * Get a stored region
             * @param name
             * @returns {Region}
             */
            get: function (name) {
                return this._regions[name];
            },

            /**
             * Add a region as defined by definition, at the key name
             * @param name {string} Name to identify the region
             * @param definition {Region|Object|String} A region to store, or
             *          an Object with attribute to create a new Region with, or
             *          a String to create a new Region with.
             * @returns {this}
             */
            addRegion: function (name, definition) {
                if (!_.isUndefined(definition)) {
                    // Although numbers are acceptable keys, it is not recommended
                    if (!_.isString(name)) {
                        throw new TypeError('Expected name to be a string');
                    }

                    var region;
                    // If definition is a Region, then use it directly.
                    // Otherwise, attempt to create a new Region
                    if (definition instanceof Region) {
                        region = definition;
                    } else {
                        // Let region test the definition
                        region = new Region(definition);
                    }

                    this._store(name, region);
                }
                return this;
            },

            /**
             * Add multiple regions via one method call
             * @param regions {Object} Name:Definition pairs to pass to addRegion
             * @returns {*}
             */
            addRegions: function (regions) {
                _.each(regions, function (definition, name) {
                    this.addRegion(name, definition);
                }, this);
                return this;
            },

            /**
             * Remove the named region
             * @param name {string}
             * @returns {this}
             */
            removeRegion: function (name) {
                if (this.has(name)) {
                    this._regions[name].close();
                    delete this._regions[name];
                    this._setLength();
                }
                return this;
            },

            /**
             * Close all regions, but leave them attached
             * @returns {this}
             */
            closeRegions: function () {
                _.each(this._regions, function (region) {
                    region.close();
                }, this);
                return this;
            },

            /**
             * Remove all regions
             * @returns {this}
             */
            close: function () {
                _.each(this._regions, function (region, name) {
                    this.removeRegion(name);
                }, this);
                return this;
            }
        });

        // The following code is inspired by Backbone's source code
        // See http://backbonejs.org/docs/backbone.html#section-71 (As of 08/22/2013)
        // Underscore methods that we want to implement on the RegionManager
        var regionMethods = [
            'each', 'map', 'find', 'filter', 'reject', 'every',
            'some', 'contains', 'invoke', 'toArray', 'keys',
            'values', 'pairs', 'pick', 'omit', 'has'
        ];
        _.each(regionMethods, function(method) {
            RegionManager.prototype[method] = function() {
                var args = _.toArray(arguments);
                args.unshift(this._regions);
                return _[method].apply(_, args);
            };
        });

        return RegionManager;
    }
);