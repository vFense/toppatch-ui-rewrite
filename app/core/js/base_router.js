/**
 * base_router.js
 * ------------------------------------------------------------------------
 * Backbone.Router function overrides
 */
define(['backbone'], function () {
    'use strict';
    return Backbone.Router.extend({
        constructor: function(){
            Backbone.Router.prototype.constructor.apply(this, _.toArray(arguments));
            this.on('route', this.updateLastFragment);
            return this;
        },

        lastFragment: null,
        currentFragment: null,
        updateLastFragment: function () {
            this.lastFragment = this.currentFragment;
            this.currentFragment = Backbone.history.getFragment();
            return this;
        }
    });
});
