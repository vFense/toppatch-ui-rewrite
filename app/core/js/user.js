define(
    [],
    function () {
        'use strict';
        return Backbone.Model.extend({
            defaults: {
                username: 'John Doe'
            },
            url: '/api/user',
            parse: function (response) {
                this.apiMessage = response.message;
                this.apiPass = response.pass;
                return response.data;
            },
            hasPermission: function (need) {
                return _.indexOf(this.get('permissions'), need) !== -1;
            }
        });
    }
);
