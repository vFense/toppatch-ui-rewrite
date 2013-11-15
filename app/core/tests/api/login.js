define(
    ['core/tests/api/mockApi'],
    function (mockApi) {
        'use strict';
        var mock = _.extend(mockApi, {
            id: $.mockjax({
                url:  '/login',
                type: 'POST',
                responseTime: 1,
                contentType: 'application/json',
                response: function (settings) {
                    if (settings.data.user === 'test' && settings.data.password === 'test') {
                        this.status = 200;
                        this.statusText = 'valid';
                        this.responseText = {
                            message: 'logged in.'
                        }
                    } else {
                        this.status = 404;
                        this.statusText = 'invalid';
                        this.responseText = {
                            message: 'User not found.'
                        }
                    }
                }
            })
        });
        return mock;
    }
);