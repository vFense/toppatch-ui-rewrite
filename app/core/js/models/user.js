/**
 * @class User
 * @extends Backbone.Model
 */
define(
    function () {
        'use strict';
        return Backbone.Model.extend({
            /**
             * @attribute defaults
             * @default { username: 'John Doe' }
             */
            defaults: {
                username: 'John Doe'
            },
            /**
             * @attribute url
             * @default '/api/user'
             * @protected
             */
            url: '/api/user',
            /**
             * Parse the api response
             * @method parse
             * @param response {jqXHR}
             * @returns Object
             */
            parse: function (response) {
                return _.result(response, 'data');
            },
            /**
             * Check user permissions
             * @param need {string}
             * @returns {boolean}
             */
            hasPermission: function (need) {
                return _.indexOf(this.get('permissions'), need) !== -1;
            }
        });
    }
);
