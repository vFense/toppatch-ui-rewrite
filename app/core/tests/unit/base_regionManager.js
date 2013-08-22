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

    asyncTest('_store', function () {
        require(
            ['core/js/base_regionManager'],
            function (RegionManager) {
                var regionManager = new RegionManager(),
                    regions = regionManager._regions;

                // Since _store is a private function, it assumes
                // the variables passed to it are correct. We can
                // use this fact to make simple tests.
                regionManager._store('a', '1');
                strictEqual(regionManager.length, 1);
                strictEqual(regions.a, '1');

                regionManager._store('b', {});
                strictEqual(regionManager.length, 2);
                deepEqual(regions.b, {});

                regionManager._store('c', []);
                strictEqual(regionManager.length, 3);
                deepEqual(regions.c, []);

                // Overwrite c, length should remain 3
                regionManager._store('c', 2);
                strictEqual(regionManager.length, 3);
                strictEqual(regions.c, 2);

                start();
            }
        );
    });
});
