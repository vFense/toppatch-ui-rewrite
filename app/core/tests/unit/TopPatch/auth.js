$(document).ready(function () {
    'use strict';
    module('TopPatch/auth');

    asyncTest('SignIn Success', function () {
        require(
            ['core/js/TopPatch/auth', 'core/tests/api/login'],
            function (TopPatch) {
                var Auth = TopPatch.Auth,
                    done = function () {
                        Backbone.off();
                        start();
                    };

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
                        ok(false, 'signIn().then(doneCallback)');
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
            function (TopPatch) {
                var Auth = TopPatch.Auth,
                    done = function () {
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

    asyncTest('SignOut Success', function () {
        require(
            ['core/js/TopPatch/auth', 'core/tests/api/logout'],
            function (TopPatch) {
                var Auth = TopPatch.Auth,
                    done = function () {
                        Backbone.off();
                        start();
                    };

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
            function (TopPatch, logoutAPI) {
                var Auth = TopPatch.Auth,
                    done = function () {
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
