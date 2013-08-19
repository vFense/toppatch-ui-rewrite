/**
 * base_router.js
 * ------------------------------------------------------------------------
 * Backbone.Router function overrides
 */
define(['core/js/base_deps'], function () {
    'use strict';
    return Backbone.Router.extend({
        constructor: function(){
            Backbone.Router.prototype.constructor.apply(this, _.toArray(arguments));
            this.on('route', this.updateFragments);
            return this;
        },

        lastFragment: null,
        currentFragment: null,
        updateFragments: function () {
            this.lastFragment = this.currentFragment;
            this.currentFragment = Backbone.history.getFragment();
            return this;
        }
    });
});
