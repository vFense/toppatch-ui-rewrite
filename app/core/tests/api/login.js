define(
    ['core/tests/api/mockApi'],
    function (mockApi) {
        'use strict';
        return mockApi({
            url:  '/login',
            type: 'POST',
            response: function (settings) {
                if (settings.data.user === 'test' && settings.data.password === 'test') {
                    this.status = 200;
                    this.statusText = 'OK';
                    this.responseText = JSON.stringify({
                        message: 'valid'
                    });
                } else {
                    this.status = 401;
                    this.statusText = 'Unauthorized';
                    this.responseText = JSON.stringify({
                        message: 'invalid'
                    });
                }
            }
        });
    }
);
