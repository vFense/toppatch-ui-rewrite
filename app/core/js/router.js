/**
 * A Backbone.Router that tracks the current and last fragments
 *
 * @module Core
 * @class Router
 * @extends Backbone.Router
 */
define(function () {
    'use strict';
    return Backbone.Router.extend({
        /**
         * Create an instance of Router.
         * Also creates an event to call this.updateFragments
         * on the route event.
         * @method constructor
         * @chainable
         * @returns {this}
         */
        constructor: function(){
            Backbone.Router.prototype.constructor.apply(this, arguments);
            this.on('route', this.updateFragments);
            return this;
        },

        /**
         * Track the last visited route
         * @attribute lastFragment
         * @type String
         * @default null
         */
        lastFragment: null,

        /**
         * Track the current route
         * @attribute currentFragment
         * @type String
         * @default null
         */
        currentFragment: null,

        /**
         * Track the current and last fragment
         * @method updateFragments
         * @chainable
         * @returns {this}
         */
        updateFragments: function () {
            this.lastFragment = this.currentFragment;
            this.currentFragment = Backbone.history.getFragment();
            return this;
        }
    });
});
