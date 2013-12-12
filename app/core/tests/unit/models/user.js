$(document).ready(function () {
    'use strict';
    module('models/user');

    asyncTest('parse', function () {
        require(
            ['core/js/models/user'],
            function (User) {
                var user = new User(),
                    response = {
                        data: 'data'
                    },
                    result = user.parse(response);

                strictEqual(result, 'data', 'Parsed correctly');

                start();
            }
        );
    });

    asyncTest('hasPermission', function () {
        require(
            ['core/js/models/user'],
            function (User) {
                var user = new User({
                    permissions: ['admin']
                });

                strictEqual(user.hasPermission('admin'), true);
                strictEqual(user.hasPermission('other'), false);

                start();
            }
        );
    });
});
