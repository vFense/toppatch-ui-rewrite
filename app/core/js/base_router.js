/**
 * base_router.js
 * ------------------------------------------------------------------------
 * Backbone.Router function overrides
 *
 * Includes:
 */
define(['backbone'], function () {
    'use strict';
    return Backbone.Router.extend({
        // Constructor override to track fragments on route event
        constructor: function(){
            Backbone.Router.prototype.constructor.apply(this, _.toArray(arguments));
            this.on('route', this.updateLastFragment);
            return this;
        },

        // Fragment Tracking
        lastFragment: null,
        currentFragment: null,
        updateLastFragment: function () {
            this.lastFragment = this.currentFragment;
            this.currentFragment = Backbone.history.getFragment();
            return this;
        }
    });
});
