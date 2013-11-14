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
    ['exports'],
    function (exports) {
        'use strict';
        exports.Auth = _.extend({}, Backbone.Events, {
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
                            this.trigger('signInSuccess');
                        }, this)
                    )
                    .fail(
                        _.bind(function (response, status) {
                            this.trigger('signInError', status);
                        }, this)
                    )
                    .always(
                        _.bind(function () {
                            this.trigger('signInComplete');
                        }, this)
                    )
                ;
            },
            /**
             * Attempt username/password combination sign in
             * @param user {string}
             * @param password {string}
             * @returns {jqXHR}
             */
            signIn: function (user, password) {
                return this._doSignIn({
                    data: {
                        name: user,
                        password: password
                    }
                });
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
                            this.signedIn = false;
                            if (Modernizr.localStorage) {
                                localStorage.clear();
                            }
                            if (Modernizr.sessionStorage) {
                                sessionStorage.clear();
                            }
                            this.trigger('signOutSuccess');
                        }, this)
                    )
                    .fail(
                        _.bind(function (response, status) {
                            this.trigger('signOutError', status);
                        }, this)
                    )
                    .always(
                        _.bind(function () {
                            this.trigger('signOutComplete');
                        }, this)
                    )
                ;
            }
        });
    }
);
