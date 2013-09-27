$(document).ready(function () {
    'use strict';
    module('Cached Collection');

    asyncTest('Constructor', function () {
        require(['core/js/cachedCollection'], function(Collection) {
            var collection;

            ok(collection = new Collection(), 'Construct with no options');
            strictEqual(collection.cache, true, 'cache = true');
            strictEqual(collection.prefill, false, 'prefill = false');
            strictEqual(collection.expires, 5, 'expires = 5');

            ok(collection = new Collection({
                cache: false,
                prefill: true,
                expires: 10
            }), 'Construct with options');
            strictEqual(collection.cache, false, 'cache = false');
            strictEqual(collection.prefill, true, 'prefill = true');
            strictEqual(collection.expires, 10, 'expires = 10');

            start();
        });
    });

    asyncTest('Fetch and parse', function () {
        require(['core/js/cachedCollection'], function(Collection) {
            var TestCollection = Collection.extend({
                    url: '/core/tests/api/test.json'
                }),
                collection = new TestCollection();

            ok(collection.fetch({
                success: function (collection) {
                    ok(true, 'Test json loaded');

                    strictEqual(collection.length, 1, 'collection.length = 1');

                    ok(_.isObject(collection.meta), 'collection.meta is defined');
                    ok(_.has(collection.meta, 'count'), 'collection meta has count');

                    var model = collection.last();
                    strictEqual(model.get('name'), 'John Doe', 'Model.name = "John Doe"');

                    var cache = Backbone.fetchCache._cache,
                        cacheKey = Backbone.fetchCache.getCacheKey(collection, collection.fetchOptions);
                    ok(_.has(cache, cacheKey), 'collection is cached');

                    start();
                },
                error: function (collection, response) {
                    ok(false, 'Fetch Error: ' + (response.responseText || response.statusText));
                    start();
                }
            }), 'Fetching test json');
        });
    });
});
