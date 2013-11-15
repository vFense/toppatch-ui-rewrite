define(
    ['core/tests/api/mockApi'],
    function (mockApi) {
        'use strict';
        var mock = _.extend(mockApi, {
            id: $.mockjax({
                url:  '/hello',
                type: 'GET',
                responseTime: 1,
                contentType: 'application/json',
                responseText: 'Hello World!'
            })
        });
        return mock;
    }
);