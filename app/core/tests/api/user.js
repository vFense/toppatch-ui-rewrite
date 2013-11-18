define(
    ['core/tests/api/mockApi'],
    function (mockApi) {
        'use strict';
        return mockApi({
            url:  '/user',
            type: 'GET',
            responseText: JSON.stringify({
                "message": "",
                "data": {
                    "username": "admin",
                    "current_customer": {
                        "name": "default"
                    },
                    "groups": [
                        {
                            "name": "Administrator",
                            "id": "5f922dec-2dbe-4544-9264-5ae99224afb4"
                        },
                        {
                            "name": "Install Only",
                            "id": "724a5839-566f-432c-8187-1cfc8989093a"
                        },
                        {
                            "name": "Read Only",
                            "id": "87582f82-bfb7-41df-8198-ba64945f6d2d"
                        }
                    ],
                    "enabled": true,
                    "customers": [
                        {
                            "name": "Test 1"
                        },
                        {
                            "name": "default"
                        }
                    ],
                    "full_name": "TopPatch Admin Account",
                    "default_customer": {
                        "name": "default"
                    },
                    "user_name": "admin",
                    "email": "admin@toppatch.com",
                    "permissions": [
                        "admin",
                        "install"
                    ]
                },
                "pass": true
            })
        });
    }
);
