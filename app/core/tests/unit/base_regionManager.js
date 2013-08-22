$(document).ready(function () {
    'use strict';
    module('RegionManager', {
        setup: $.noop,
        teardown: $.noop
    });

    asyncTest('constructor', function () {
        require(
            ['core/js/base_regionManager'],
            function (RegionManager) {
                var regionManager = new RegionManager();
                deepEqual(regionManager._regions, {}, 'Default _regions is empty object');
                strictEqual(regionManager.length, 0, 'Default length is 0');
                start();
            }
        );
    });

    // We want to make sure that each mixin works
    // as expected within the RegionManager context.
    // Each underscore method is fully trusted.
    asyncTest('regionMethod mixins', function () {
        require(
            ['core/js/base_regionManager'],
            function (RegionManager) {
                var regionManager = new RegionManager(),
                    result;

                regionManager._regions = { a: 1, b: 2, c: 3, d: 4 };

                // Tests based on Underscore examples
                // Each
                result = [];
                regionManager.each(function (value) {
                    result.push(value);
                });
                deepEqual(result, [1, 2, 3, 4], 'Each');

                // Map
                result = regionManager.map(function (value, key) {
                    return key;
                });
                deepEqual(result, ['a', 'b', 'c', 'd'], 'Map');

                // Find
                result = regionManager.find(function (value) {
                    return value % 2 === 0;
                });
                strictEqual(result, 2, 'Find okay');

                // Filter
                result = regionManager.filter(function (value) {
                    return value % 2 === 0;
                });
                deepEqual(result, [2, 4], 'Filter');

                // Reject
                result = regionManager.reject(function (value) {
                    return value % 2 === 0;
                });
                deepEqual(result, [1, 3], 'Reject');

                // Every
                result = regionManager.every(function (value) {
                    return value % 2 === 0;
                });
                strictEqual(result, false, 'Every');

                // Some
                result = regionManager.some(function (value) {
                    return value % 2 === 0;
                });
                strictEqual(result, true, 'Some');

                // Contains
                result = regionManager.contains(3);
                strictEqual(result, true, 'Contains');

                // Invoke
                result = 0;
                regionManager.invoke(function () { result += 1; });
                strictEqual(result, 4, 'Invoke');

                // toArray
                result = regionManager.toArray();
                deepEqual(result, [1, 2, 3, 4], 'toArray');

                // Keys
                result = regionManager.keys();
                deepEqual(result, ['a', 'b', 'c', 'd'], 'Keys');

                // Values
                result = regionManager.values();
                deepEqual(result, [1, 2, 3, 4], 'Values');

                // Pairs
                result = regionManager.pairs();
                deepEqual(result, [['a', 1], ['b', 2], ['c', 3], ['d', 4]], 'Pairs');

                // Pick
                result = regionManager.pick('a', 'd');
                deepEqual(result, {a:1, d:4}, 'Pick');

                // Omit
                result = regionManager.omit('a', 'd');
                deepEqual(result, {b:2, c:3}, 'Omit');

                // Has
                result = regionManager.has('b');
                strictEqual(result, true, 'Has');

                start();
            }
        );
    });

    asyncTest('_setLength', function () {
        require(
            ['core/js/base_regionManager'],
            function (RegionManager) {
                var regionManager = new RegionManager(),
                    result;

                result = regionManager._setLength();
                strictEqual(regionManager.length, 0);
                strictEqual(result, regionManager, '_setLength returned this');

                regionManager._regions = { a:1, b:2 };
                regionManager._setLength();
                strictEqual(regionManager.length, 2);

                regionManager._regions = { a:1, b:2, c:3, d:4 };
                regionManager._setLength();
                strictEqual(regionManager.length, 4);

                start();
            }
        );
    });

    asyncTest('_store', function () {
        require(
            ['core/js/base_regionManager'],
            function (RegionManager) {
                var regionManager = new RegionManager(),
                    regions = regionManager._regions,
                    result;

                // Since _store is a private function, it assumes
                // the variables passed to it are correct. We can
                // use this fact to make simple tests.
                result = regionManager._store('a', '1');
                strictEqual(result, regionManager, '_store() returned regionManager');
                strictEqual(regionManager.length, 1, 'Length okay');
                strictEqual(regions.a, '1', 'Value stored at correct key');

                regionManager._store('b', {});
                strictEqual(regionManager.length, 2, 'Length okay');
                deepEqual(regions.b, {}, 'Value stored at correct key');

                regionManager._store('c', []);
                strictEqual(regionManager.length, 3, 'Length okay');
                deepEqual(regions.c, [], 'Value stored at correct key');

                // Overwrite c, length should remain 3
                regionManager._store('c', 2);
                strictEqual(regionManager.length, 3, 'Length okay');
                strictEqual(regions.c, 2, 'Value stored at correct key');

                start();
            }
        );
    });

    asyncTest('get', function () {
        require(
            ['core/js/base_regionManager', 'core/js/base_region'],
            function (RegionManager, Region) {
                var regionManager = new RegionManager();

                regionManager._regions = { a: 1, b: 2, c: 3, d: 4 };

                strictEqual(regionManager.get('a'), 1);
                strictEqual(regionManager.get('b'), 2);
                strictEqual(regionManager.get('c'), 3);
                strictEqual(regionManager.get('d'), 4);

                start();
            }
        );
    });

    asyncTest('addRegion', function () {
        require(
            ['core/js/base_regionManager', 'core/js/base_region'],
            function (RegionManager, Region) {
                var regionManager = new RegionManager(),
                    region = new Region('body'),
                    result;

                // addRegion with no arguments
                result = regionManager.addRegion();
                strictEqual(regionManager.length, 0, 'addRegion called with no arguments, added 0 regions');
                strictEqual(result, regionManager, 'addRegion returns this');

                // Call addRegion with invalid 'name' argument
                QUnit.throws(function () {
                    regionManager.addRegion(1, 'body');
                }, TypeError, 'addRegion throws TypeError when "name" is not a string');

                // Call addRegion with Region object as region argument
                result = regionManager.addRegion('header', region);
                ok(regionManager.has('header'), 'addRegion added "header" to _regions');
                strictEqual(regionManager.get('header'), region,
                    'Header region is properly stored'
                );
                strictEqual(regionManager.length, 1, 'regionManager now has 1 region');

                // Call addRegion with string as region argument
                result = regionManager.addRegion('main', '#main');
                ok(regionManager.has('main'), 'addRegion added "main" to _regions');
                deepEqual(regionManager.get('main'), new Region('#main'),
                    'Main region is properly created, and stored'
                );
                strictEqual(regionManager.length, 2, 'regionManager now has 2 regions');

                // Call addRegion with plain object as region argument
                result = regionManager.addRegion('footer', {el: '#footer'});
                ok(regionManager.has('footer'), 'addRegion added "footer" to _regions');
                deepEqual(regionManager.get('footer'), new Region({el: '#footer'}),
                    'Footer region is properly created, and stored'
                );
                strictEqual(regionManager.length, 3, 'regionManager now has 3 regions');

                start();
            }
        );
    });
});
