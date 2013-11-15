$(document).ready(function () {
    'use strict';
    module('mockApi');

    asyncTest('Test', function () {
        require(['core/tests/api/helloworld'], function (mockApi) {
            console.log(mockApi);
            $.ajax({
                url: '/hello',
                type: 'GET',
                contentType: 'application/json',
                dataType: 'json',
                complete: function (response) { console.log(response); }
            });
            ok(true, 'Test');
            start();
        });
    });
});