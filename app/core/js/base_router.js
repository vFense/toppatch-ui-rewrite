/**
 * base_router.js
 * ------------------------------------------------------------------------
 * Backbone.Router function overrides
 */
define(['core/js/base_deps'], function () {
    'use strict';
    return Backbone.Router.extend({
        /**
         * Call updateFragments on the route event
         * @override
         * @returns {*}
         */
        constructor: function(){
            Backbone.Router.prototype.constructor.apply(this, _.toArray(arguments));
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
