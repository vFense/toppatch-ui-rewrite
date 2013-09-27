define(
    ['backbone.fetchCache'],
    function () {
        'use strict';
        var defaultOptions = ['cache', 'prefill', 'expires'];
        return Backbone.Collection.extend({
            cache: true,
            prefill: false,
            expires: 5, // Seconds
            constructor: function (options) {
                if (_.isObject(options)) {
                    _.extend(this, _.pick(options, defaultOptions));
                }
                return Backbone.Collection.prototype.constructor.apply(this, arguments);
            },
            fetch: function (options) {
                _.defaults(options, {
                    data: {},
                    cache: this.cache,
                    expires: this.expires
                });
                this.fetchOptions = options;
                return Backbone.Collection.prototype.fetch.call(this, options);
            },
            parse: function (response, options) {
                this.meta = _.extend({}, _.omit(response, 'data'));
                return Backbone.Collection.prototype.parse.call(this, response.data, options);
            }
        });
    }
);
