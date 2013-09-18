define(
    ['core/js/region'],
    function () {
        'use strict';
        var Region = require('core/js/region');
        /**
         * Manage multiple Regions from one location
         *
         * Inspired by Backbone.Marionette.regionManager
         * @class RegionManager
         * @requires Region
         * @constructor
         * @returns {this}
         */
        var RegionManager = function () {
            this._regions = {};
            this.length = 0;
            return this;
        };

        _.extend(RegionManager.prototype, {
            /**
             * Set the this.length
             * @method _setLength
             * @returns {this}
             * @chainable
             * @private
             */
            _setLength: function () {
                this.length = _.size(this._regions);
                return this;
            },

            /**
             * Add the region to the _regions object at the named key
             * Update the cached _regions length
             * @method _store
             * @param name {String} Key Name
             * @param region {Region} Region to store
             * @returns {this}
             * @chainable
             * @private
             */
            _store: function (name, region) {
                this._regions[name] = region;
                this._setLength();
                return this;
            },

            /**
             * Get a stored region
             * @method get
             * @param name {String} Key name
             * @returns {Region} Region at key name
             */
            get: function (name) {
                return this._regions[name];
            },

            /**
             * Add a region as defined by definition, at the key name
             * @method addRegion
             * @param name {string} Name to identify the region
             * @param definition {Region|Object|String} A region to store, or
             *          an Object with attribute to create a new Region with, or
             *          a String to create a new Region with.
             * @returns {this}
             * @chainable
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
             * @method addRegions
             * @param regions {Object} Name:Definition pairs to pass to addRegion
             * @param defaults {Object} Options to default into each definition
             * @returns {*}
             * @chainable
             */
            addRegions: function (regions, defaults) {
                _.each(regions, function (definition, name) {
                    if (_.isString(definition)) {
                        definition = { el: definition };
                    }

                    if (!_.isUndefined(defaults)) {
                        // _.defaults will only replace values that are undefined
                        definition = _.defaults({}, definition, defaults);
                    }

                    this.addRegion(name, definition);
                }, this);
                return this;
            },

            /**
             * Remove the named region
             * @method removeRegion
             * @param name {string}
             * @returns {this}
             * @chainable
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
             * @method closeRegions
             * @returns {this}
             * @chainable
             */
            closeRegions: function () {
                _.each(this._regions, function (region) {
                    region.close();
                }, this);
                return this;
            },

            /**
             * Remove all regions
             * @method close
             * @returns {this}
             * @chainable
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
