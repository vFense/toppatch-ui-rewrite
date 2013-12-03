define(
    ['core/tests/api/mockApi'],
    function (mockApi) {
        'use strict';
        function authenticate (user, pass) {
            return user === 'test' && pass === 'test';
        };
        return mockApi({
            url:  '/login',
            type: 'POST',
            response: function (settings) {
                var username = settings.data.username,
                    password = settings.data.password;
                if (username && password) {
                    var authenticated = authenticate(username, password);

                    if (authenticated) {
                        this.status = 200;
                        this.statusText = 'OK';
                        this.responseText = JSON.stringify({
                            user: {}
                        });
                    } else {
                        this.status = 401;
                        this.statusText = 'Unauthorized';
                        this.responseText = JSON.stringify({
                            error: 'Unauthorized'
                        });
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
