define(
    ['core/tests/api/mockApi'],
    function (mockApi) {
        'use strict';
        var authorized = {
                status: 200,
                statusText: 'OK',
                responseText: JSON.stringify({
                    user: {}
                })
            },
            unauthorized = {
                status: 401,
                statusText: 'Unauthorized',
                responseText: JSON.stringify({
                    error: 'Unauthorized'
                })
            };
        return mockApi({
            url:  '/login',
            type: 'POST',
            response: function (settings) {
                var username = settings.data.username,
                    password = settings.data.password,
                    uri      = settings.data.uri;
                if (uri) {
                    if (uri === 'test') {
                        $.extend(this, authorized);
                    } else {
                        $.extend(this, unauthorized);
                    }
                } else if (username && password) {
                    var authenticated = (username === 'test' && password === 'test');

                    if (authenticated) {
                        $.extend(this, authorized);
                    } else {
                        $.extend(this, unauthorized);
                    }
                } else {
                    var result = {};
                    if (!username) { result.username = ['Username is required']; }
                    if (!password) { result.username = ['Password is required']; }
                    this.status = 400;
                    this.responseText = JSON.stringify(result);
                }
            }
        });
    }
);
