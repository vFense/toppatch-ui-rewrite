define(
    ['core/tests/api/mockApi'],
    function (mockApi) {
        'use strict';
        return mockApi({
            url:  '/logout',
            type: 'GET',
            responseText: JSON.stringify({
                message: 'logged out'
            })
        });
    }
);
