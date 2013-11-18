define(
    ['core/tests/api/mockApi'],
    function (mockApi) {
        'use strict';
        return mockApi({
            url:  '/hello',
            type: 'GET',
            responseText: 'Hello World!'
        });
    }
);
