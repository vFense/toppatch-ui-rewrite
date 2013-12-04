/**
 * Authentication module that handles login and logout processes,
 * as well as maintaining the user model.
 *
 * @class Auth
 * @static
 */
/**
 * Fired upon sign in success
 * @event signInSuccess
 */
/**
 * Fired upon sign in fail
 * @event signInError
 * @param {string} status A description of the error
 */
/**
 * Fired when after sign in success or fail
 * @event signInComplete
 */
/**
 * Fired upon sign out success
 * @event signOutSuccess
 */
/**
 * Fired upon sign out fail
 * @event signOutError
 * @param {string} status A description of the error
 */
/**
 * Fired when after sign out success or fail
 * @event signOutComplete
 */
define(
    ['backbone', 'core/js/TopPatch/constants', 'jquery.cookie'],
    function (Backbone, CONST) {
        'use strict';
        return {
            /**
             * Indicates whether this sessions is authenticated or not.
             * @attribute signedIn
             * @default false
             * @readOnly
             */
            signedIn: false,

            /**
             * Attempt to sign in
             * @method _doSignIn
             * @private
             * @param options {object} $.ajax settings, should include data attribute
             * @returns {jqXHR} See: http://api.jquery.com/Types/#jqXHR
             */
            _doSignIn: function (options) {
                var defaults = { url: '/login', type: 'POST' },
                    settings = _.merge(defaults, options);
                return $
                    .ajax(settings)
                    .done(
                        _.bind(function () {
                            this.signedIn = true;
                            Backbone.trigger('signInSuccess');
                        }, this)
                    )
                    .fail(
                        _.bind(function (response, status) {
                            Backbone.trigger('signInError', status);
                        }, this)
                    )
                    .always(
                        _.bind(function () {
                            Backbone.trigger('signInComplete');
                        }, this)
                    )
                ;
            },

            /**
             * Attempt username/password combination sign in
             * @param username {string}
             * @param password {string}
             * @returns {jqXHR}
             */
            signIn: function (username, password) {
                return this._doSignIn({
                    data: {
                        username: username,
                        password: password
                    }
                });
            },

            rememberMeSignIn: function () {
                if ($.cookie(CONST.COOKIE.AUTH)) {
                    return this._doSignIn({
                        data: {
                            uri: 42 // Preparing for future use case
                        }
                    });
                }
                return false;
            },

            /**
             * Attempt to log out.
             * @method signOut
             * @returns {jqXHR} See: http://api.jquery.com/Types/#jqXHR
             */
            signOut: function () {
                return $
                    .ajax({
                        url: '/logout',
                        type: 'get'
                    })
                    .done(
                        _.bind(function () {
                            this.forgetLogin();
                            Backbone.trigger('signOutSuccess');
                        }, this)
                    )
                    .fail(
                        _.bind(function (response, status) {
                            Backbone.trigger('signOutError', status);
                        }, this)
                    )
                    .always(
                        _.bind(function () {
                            Backbone.trigger('signOutComplete');
                        }, this)
                    )
                ;
            },

            forgetLogin: function () {
                // Server removes cookie for us

                /*
                // Not using localStorage yet
                if (_.isObject(localStorage) && _.isFunction(localStorage.clear)) {
                    localStorage.clear();
                }

                // Not using sessionStorage yet
                if (_.isObject(sessionStorage) && _.isFunction(sessionStorage.clear)) {
                    sessionStorage.clear();
                }
                */

                this.signedIn = false;
                return this;
            }
        };
    }
);
