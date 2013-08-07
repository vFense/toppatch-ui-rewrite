/**
 * base_router.js
 * ------------------------------------------------------------------------
 * Backbone.Router function overrides
 *
 * Includes:
 */
define(['backbone'], function () {
    "use strict";
    var __super__ = Backbone.Router.prototype;
    return Backbone.Router.extend({
        __super__: __super__,
        _navigate: __super__.navigate,
        navigate: function (fragment, options) {
            // Override
            // Call updateFragments after navigate
            this._navigate.call(this, fragment, options);
            return this.updateFragments();
        },

        _route: __super__.route,
        route: function (route, name, callback) {
            // Override
            // Wrap callback so that we always updateFragments
            // before running the original callback
            if (!callback) { callback = this[name]; }
            var that = this,
                newCallback = function () {
                    that.updateFragments();
                    if (callback) { callback.apply(that, arguments); }
                };
            return this._route.call(this, route, name, newCallback);
        },

        // Getters/Setters
        updateFragments: function () {
            var newFragment = Backbone.history.getFragment();
            if (this.currentFragment !== newFragment) {
                this.lastFragment = this.currentFragment;
                this.currentFragment = newFragment;
            }
            return this;
        },
        getCurrentFragment: function () { return this.currentFragment; },
        getLastFragment: function () { return this.lastFragment; }
    });
});
