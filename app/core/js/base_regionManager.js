/**
 * base_regionManager.js
 * ------------------------------------------------------------------------
 * Manage multiple Regions from one location
 *
 * Inspired by Backbone.Marionette.regionManager
 */
define(
    ['core/js/base_region'],
    function (Region) {
        'use strict';
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
             * Add the region to the _regions object at the named key
             * Update the cached _regions length
             * @param name
             * @param region
             * @returns {this}
             * @private
             */
            _store: function (name, region) {
                this._regions[name] = region;
                this.length = _.size(this._regions);
                return this;
            },
        });

        // The following code is inspired by Backbone's source code
        // See http://backbonejs.org/docs/backbone.html#section-71 (As of 08/22/2013)
        // Underscore methods that we want to implement on the RegionManager
        var regionMethods = [];
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
