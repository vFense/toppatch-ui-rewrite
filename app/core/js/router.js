/**
 * A Backbone.Router that tracks the current and last fragments
 *
 * @module Core
 * @class Router
 * @extends Backbone.Router
 */
define(
    ['core/js/TopPatch/Auth', 'backbone'],
    function (TopPatch) {
        'use strict';
        var Auth = TopPatch.Auth;
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
             */
            updateFragments: function () {
                this.lastFragment = this.currentFragment;
                this.currentFragment = Backbone.history.getFragment();
                return this;
            },

            /**
             * Manually create an authorized route for the router.
             *
             * It is mostly equivalent to the route method, only it checks if the user is signed in before continuing
             *
             * See: [Backbone.Router - route](http://backbonejs.org/#Router-route)
             * @method authRoute
             * @param route {string|RegExp} Routing string, or regular expression
             * @param name {string|function} If string, will be triggered as "route:name". If function, will be used as callback.
             * @param [callback] {function} If omitted, and name is a string, router[name] will be used instead
             * @chainable
             */
            authRoute: function (route, name, callback) {
                if (!_.isRegExp(route)) { route = this._routeToRegExp(route); }
                if (_.isFunction(name)) {
                    callback = name;
                    name = '';
                }
                if (!callback) { callback = this[name]; }
                var router = this;
                Backbone.history.route(route, function(fragment) {
                    var args = router._extractParameters(route, fragment);
                    if (Auth.signedIn === true) {
                        if (callback) {
                            callback.apply(router, args);
                        }
                        router.trigger.apply(router, ['route:' + name].concat(args));
                        router.trigger('route', name, args);
                        Backbone.history.trigger('route', router, name, args);
                    } else {
                        router.attemptedRoute = fragment;
                        router.navigate('login', {trigger:true, replace: true});
                    }
                });
                return this;
            },
        });
    }
);
