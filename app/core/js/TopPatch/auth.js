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
    ['backbone', 'core/js/TopPatch/constants', 'core/js/models/user', 'jquery.cookie'],
    function (Backbone, CONST, User) {
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
             * @returns {JQueryDeferred} See: http://api.jquery.com/Types/#jqXHR
             */
            _doSignIn: function (options) {
                var _this = this,
                    defaults = { url: '/login', type: 'POST' },
                    settings = _.merge(defaults, options);
                return $
                    .ajax(settings)
                    .done(
                        function (response, status, xhr) {
                            _this.signedIn = true;
                            _this.user = new User(response.data);
                            Backbone.trigger('signInSuccess', response, status, xhr);
                        }
                    )
                    .fail(
                        function (xhr, status, error) {
                            Backbone.trigger('signInError', xhr, status, error);
                        }
                    )
                    .always(
                        function (xhr, status) {
                            Backbone.trigger('signInComplete', xhr, status);
                        }
                    )
                ;
            },

            /**
             * Attempt username/password combination sign in
             * @param username {string}
             * @param password {string}
             * @returns {JQueryDeferred}
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
                    var _this = this;
                    return this._doSignIn({
                        data: {
                            uri: $.cookie(CONST.COOKIE.AUTH) // Preparing for future use case
                        },
                        error: function (jqxhr) {
                            var status = jqxhr.status;
                            if (status === 401 || status === 403) {
                                _this.forgetLogin();
                            }
                        }
                    });
                }
                return false;
            },

            /**
             * Attempt to log out.
             * @method signOut
             * @returns {JQueryDeferred} See: http://api.jquery.com/Types/#jqXHR
             */
            signOut: function () {
                var _this = this;
                return $
                    .ajax({
                        url: '/logout',
                        type: 'get'
                    })
                    .done(
                        function () {
                            _this.forgetLogin();
                            Backbone.trigger('signOutSuccess');
                        }
                    )
                    .fail(
                        function (response, status) {
                            Backbone.trigger('signOutError', status);
                        }
                    )
                    .always(
                        function () {
                            Backbone.trigger('signOutComplete');
                        }
                    )
                ;
            },

            forgetLogin: function () {
                $.removeCookie(CONST.COOKIE.AUTH);
                this.signedIn = false;
                this.user = null;
                return this;
            }
        };
    }
);
