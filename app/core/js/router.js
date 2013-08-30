/**
 * base_router.js
 * ------------------------------------------------------------------------
 * A Backbone.Router that tracks the current and last fragments
 */
define(function () {
    'use strict';
    return Backbone.Router.extend({
        /**
         * Call updateFragments on the route event
         * @override
         * @returns {*}
         */
        constructor: function(){
            Backbone.Router.prototype.constructor.apply(this, arguments);
            this.on('route', this.updateFragments);
            return this;
        },

        lastFragment: null,
        currentFragment: null,

        /**
         * Track the current and last fragment
         * @returns {*}
         */
        updateFragments: function () {
            this.lastFragment = this.currentFragment;
            this.currentFragment = Backbone.history.getFragment();
            return this;
        }
    });
});
