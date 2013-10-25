/**
 * Authentication module that handles login and logout processes,
 * as well as maintaining the user model.
 *
 * @class auth
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
    ['core/js/user'],
    function (User) {
        'use strict';
        return _.extend({}, Backbone.Events, {
            /**
             * Reference to the user model.
             * @attribute user
             * @default null
             * @readOnly
             */
            user: null,
            /**
             * Indicates whether this sessions is authenticated or not.
             * @attribute signedIn
             * @default false
             * @readOnly
             */
            signedIn: false,
            /**
             * Attempt to sign in
             * @method signIn
             * @param username
             * @param password
             * @returns {jqXHR} See: http://api.jquery.com/Types/#jqXHR
             */
            signIn: function (username, password) {
                return $
                    .ajax({
                        url: '/login',
                        type: 'POST',
                        data: {
                            name: username,
                            password: password
                        }
                    })
                    .done(
                        _.bind(function () {
                            this.user = new User();
                            this.user.fetch();
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
                            this.user = null;
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
