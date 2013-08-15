/**
 * base_router.js
 * ------------------------------------------------------------------------
 * Backbone.Router function overrides
 *
 * Includes:
 */
define(['backbone'], function () {
    "use strict";
    var lastFragment,
        currentFragment;
    return Backbone.Router.extend({
        _navigate: Backbone.Router.prototype.navigate,
        navigate: function (fragment, options) {
            // Override
            // Call updateFragments after navigate
            this._navigate.call(this, fragment, options);
            return this.updateFragments();
        },

        _route: Backbone.Router.prototype.route,
        route: function (route, name, callback) {
            // Override
            // Wrap callback so that we always updateFragments
            // before running the original callback
            if (_.isFunction(name)) {
                callback = name;
                name = '';
            }
            if (!callback) { callback = this[name]; }
            var router = this,
                newCallback = function () {
                    router.updateFragments();
                    if (callback) { callback.apply(router, arguments); }
                };
            return this._route.call(this, route, name, newCallback);
        },

        // Getters/Setters
        updateFragments: function () {
            var newFragment = Backbone.history.getFragment();
            if (currentFragment !== newFragment) {
                lastFragment = currentFragment;
                currentFragment = newFragment;
            }
            return this;
        },
        getCurrentFragment: function () { return currentFragment; },
        getLastFragment: function () { return lastFragment; }
    });
});
