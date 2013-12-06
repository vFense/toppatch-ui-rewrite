/**
 * A Backbone.Router that tracks the current and last fragments
 *
 * @module Core
 * @class Router
 * @extends Backbone.Router
 */
define(
    ['core/js/TopPatch/auth', '../../.'],
    function (Auth) {
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
                if (_.isFunction(name)) {
                    callback = name;
                    name = '';
                }
                if (!callback) { callback = this[name]; }
                Backbone.Router.prototype.route.call(this, route, name, function () {
                    if(Auth.signedIn === true) {
                        if (callback) {
                            callback.apply(this, arguments);
                        }
                    } else {
                        Auth.attemptedRoute = Backbone.history.getFragment();
                        this.navigate('login', {trigger:true, replace: true});
                    }
                });
                return this;
            },

            /**
             * Bind all defined routes, and restricted routes, to Backbone.history.
             * @method _bindRoutes
             * @private
             */
            _bindRoutes: function () {
                if (!this.routes && !this.authRoutes) { return; }
                this.routes = _.result(this, 'routes');
                var route, routes = _.keys(this.routes);
                while (!_.isUndefined(route = routes.pop())) {
                    this.route(route, this.routes[route]);
                }

                // Restricted Route bindings
                this.authRoutes = _.result(this, 'authRoutes');
                route = undefined;
                routes = _.keys(this.authRoutes);
                while (!_.isUndefined(route = routes.pop())) {
                    this.authRoute(route, this.authRoutes[route]);
                }
            }
        });
    }
);
