$(document).ready(function () {
    'use strict';
    module('TopPatch/auth');

    asyncTest('SignIn Success', function () {
        require(
            ['core/js/TopPatch/auth', 'core/tests/api/login'],
            function (Auth) {
                var done = function () {
                    Backbone.off();
                    start();
                };

                Auth.signedIn = false;

                Backbone.once('signInSuccess', function () {
                    ok(true, '`signInSuccess` event fired on Backbone Object');
                });

                Backbone.once('signInError', function () {
                    ok(false, 'Unexpected `signInError` event fired on Backbone Object');
                });

                Backbone.once('signInComplete', function () {
                    ok(true, '`signInComplete` event fired on Backbone Object');
                });

                Auth.signIn('test', 'test').then(
                    function () {
                        ok(true, 'signIn().then(doneCallback)');
                        strictEqual(Auth.signedIn, true, 'Auth now indicates that we are signed in');
                        done();
                    },
                    function () {
                        ok(false, 'signIn().then(failCallback)');
                        done();
                    }
                );
            }
        );
    });

    asyncTest('SignIn Failure', function () {
        require(
            ['core/js/TopPatch/auth', 'core/tests/api/login'],
            function (Auth) {
                var done = function () {
                        Backbone.off();
                        start();
                    };

                Backbone.once('signInSuccess', function () {
                    ok(false, 'Unexpected `signInSuccess` event fired on Backbone Object');
                });

                Backbone.once('signInError', function () {
                    ok(true, '`signInError` event fired on Backbone Object');
                });

                Backbone.once('signInComplete', function () {
                    ok(true, '`signInComplete` event fired on Backbone Object');
                });

                Auth.signIn('test', 'wrong').then(
                    function () {
                        ok(false, 'signIn().then(doneCallback)');
                        done();
                    },
                    function () {
                        ok(true, 'signIn().then(failCallback)');
                        done();
                    }
                );
            }
        );
    });

    asyncTest('rememberMeSignIn', function () {
        require(
            ['core/js/TopPatch/auth', 'core/js/TopPatch/constants', 'core/tests/api/login'],
            function (Auth, CONST) {
                var done = function () {
                    Backbone.off();
                    start();
                };

                Auth.signedIn = false;

                var oldCookie = CONST.COOKIE.AUTH;
                CONST.COOKIE.AUTH = 'testAuthCookie';

                strictEqual(Auth.rememberMeSignIn(), false, 'Returns false when user cookie not present');

                Backbone.once('signInSuccess', function () {
                    ok(true, '`signInSuccess` event fired on Backbone Object');
                    strictEqual(Auth.signedIn, true, 'Auth now indicates that we are signed in');
                });

                Backbone.once('signInError', function () {
                    ok(false, 'Unexpected `signInError` event fired on Backbone Object');
                });

                Backbone.once('signInComplete', function () {
                    ok(true, '`signInComplete` event fired on Backbone Object');

                    // Clean up
                    $.removeCookie(CONST.COOKIE.AUTH);
                    CONST.COOKIE.AUTH = oldCookie;

                    done();
                });

                $.cookie(CONST.COOKIE.AUTH, 'pass');
                ok(Auth.rememberMeSignIn(), 'Attempt with test cookie in place');
            }
        );
    });

    asyncTest('rememberMeSignIn Failure', function () {
        require(
            ['core/js/TopPatch/auth', 'core/js/TopPatch/constants', 'core/tests/api/login'],
            function (Auth, CONST) {
                var done = function () {
                    Backbone.off();
                    start();
                };

                Auth.signedIn = false;

                var oldCookie = CONST.COOKIE.AUTH;
                CONST.COOKIE.AUTH = 'testAuthCookie';

                Backbone.once('signInSuccess', function () {
                    ok(false, 'Unexpected `signInSuccess` event fired on Backbone Object');
                });

                Backbone.once('signInError', function () {
                    ok(true, '`signInError` event fired on Backbone Object');
                    strictEqual($.cookie(CONST.COOKIE.AUTH), undefined, 'cookie was removed on failed login');
                });

                Backbone.once('signInComplete', function () {
                    ok(true, '`signInComplete` event fired on Backbone Object');

                    // Clean up
                    $.removeCookie(CONST.COOKIE.AUTH);
                    CONST.COOKIE.AUTH = oldCookie;

                    done();
                });

                $.cookie(CONST.COOKIE.AUTH, 'fail');
                ok(Auth.rememberMeSignIn(), 'Attempt with bad test cookie in place');
            }
        );
    });

    asyncTest('SignOut Success', function () {
        require(
            ['core/js/TopPatch/auth', 'core/tests/api/logout'],
            function (Auth) {
                var done = function () {
                        Backbone.off();
                        start();
                    };

                Auth.signedIn = true;

                Backbone.once('signOutSuccess', function () {
                    ok(true, '`signOutSuccess` event fired on Backbone Object');
                });

                Backbone.once('signOutError', function () {
                    ok(false, 'Unexpected `signOutError` event fired on Backbone Object');
                });

                Backbone.once('signOutComplete', function () {
                    ok(true, '`signOutComplete` event fired on Backbone Object');
                });

                Auth.signOut().then(
                    function () {
                        ok(true, 'signOut().then(doneCallback)');
                        strictEqual(Auth.signedIn, false, 'Auth now indicates that we are signed out');
                        done();
                    },
                    function () {
                        ok(false, 'signOut().then(failCallback)');
                        done();
                    }
                );
            }
        );
    });

    asyncTest('SignOut Failure', function () {
        require(
            ['core/js/TopPatch/auth', 'core/tests/api/logout'],
            function (Auth, logoutAPI) {
                var done = function () {
                        Backbone.off();
                        start();
                    };

                $.mockjax.handler(logoutAPI).status = 500;

                Backbone.once('signOutSuccess', function () {
                    ok(false, 'Unexpected `signOutSuccess` event fired on Backbone Object');
                });

                Backbone.once('signOutError', function () {
                    ok(true, '`signOutError` event fired on Backbone Object');
                });

                Backbone.once('signOutComplete', function () {
                    ok(true, '`signOutComplete` event fired on Backbone Object');
                });

                Auth.signOut().then(
                    function () {
                        ok(false, 'signOut().then(doneCallback)');
                        done();
                    },
                    function () {
                        ok(true, 'signOut().then(failCallback)');
                        done();
                    }
                );
            }
        );
    });
});
