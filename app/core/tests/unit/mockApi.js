$(document).ready(function () {
    'use strict';
    module('APIs');

    asyncTest('mockApi (parent class)', function () {
        require(['core/tests/api/mockApi'], function (mockApi) {
            ok(mockApi === $.mockjax, 'Returns $.mockjax');
            start();
        });
    });
    asyncTest('Hello World', function () {
        require(['core/tests/api/helloworld'], function (mockApi) {
            $.ajax({
                url: '/hello',
                type: 'GET',
                complete: function (response) {
                    ok(_.isNumber(mockApi), 'api module returns a number');
                    strictEqual(response.responseText, 'Hello World!', 'Correct value returned from API');
                    strictEqual(response.status, 200, 'Correct status code returned');
                    start();
                }
            });
        });
    });
    asyncTest('Successful Login', function () {
        require(['core/tests/api/login'], function (mockApi) {
            var data = {name: 'test', password: 'test'};
            $.ajax({
                url: '/login',
                type: 'POST',
                data: data,
                complete: function (response) {
                    ok(_.isNumber(mockApi), 'api module returns a number');
                    strictEqual(response.statusText, 'OK', 'Correct statusText returned from API');
                    strictEqual(response.status, 200, 'Correct status 200 code returned');
                    start();
                }
            });
        });
    });
    asyncTest('Invalid Login', function () {
        require(['core/tests/api/login'], function (mockApi) {
            var data = {name: 'test', password: ''};
            $.ajax({
                url: '/login',
                type: 'POST',
                data: data,
                complete: function (response) {
                    ok(_.isNumber(mockApi), 'api module returns a number');
                    strictEqual(response.statusText, 'Unauthorized', 'Correct statusText returned from API');
                    strictEqual(response.status, 401, 'Correct status 401 code returned');
                    start();
                }
            });
        });
    });
    asyncTest('User', function () {
        require(['core/tests/api/user'], function (mockApi) {
            $.ajax({
                url: '/user',
                type: 'GET',
                complete: function (response) {
                    ok(_.isNumber(mockApi), 'api module returns a number');
                    ok(_.isString(response.responseText), 'responseText is a string');
                    strictEqual(response.statusText, 'OK', 'Correct statusText returned from API');
                    strictEqual(response.status, 200, 'Correct status 401 code returned');
                    start();
                }
            });
        });
    });
});
