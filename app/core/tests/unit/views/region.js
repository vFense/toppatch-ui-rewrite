$(document).ready(function () {
    'use strict';
    module('views/region');

    asyncTest('Constructor', 7, function () {
        require(['core/js/views/region'], function (Region) {
            var testRegions = {x: 1},
                region1 = new Region({template: $.noop}),
                region2 = new Region({template: $.noop, regions: testRegions});

            ok(_.isObject(region1.regions), 'created _regions element');
            notStrictEqual(region1.regions, region2.regions, 'regions object of two different RegionViews are not the same object');

            ok(_.isUndefined(region1.isClosed), 'Region 1 is NOT rendered after construction');
            ok(_.isUndefined(region2.isClosed), 'Region 2 is NOT rendered after construction');

            deepEqual(region1.regions, {}, 'Region 1\'s regions object is empty');
            notDeepEqual(region2.regions, {}, 'Region 2\'s regions object is NOT empty');

            deepEqual(region2.regions, testRegions, 'Region 2\'s regions object is set correctly');

            start();
        });
    });

    asyncTest('Get', 3, function () {
        require(['core/js/views/region'], function (Region) {
            var region = new Region({template: $.noop});

            region.regions = {
                a: 1,
                b: 2,
                c: 3
            };

            strictEqual(region.get('a'), 1);
            strictEqual(region.get('b'), 2);
            strictEqual(region.get('c'), 3);

            start();
        });
    });

    asyncTest('Set', 4, function () {
        require(['core/js/views/region'], function (Region) {
            var region = new Region({template: $.noop});

            ok(region.set(), 'Set with no arguments');
            deepEqual(region.regions, {}, 'region.regions object remains empty');

            region.set('foo', 2);
            strictEqual(region.get('foo'), 2, 'foo should have changed');

            region.set('foo', '');
            strictEqual(region.get('foo'), '', 'foo set to empty string');

            start();
        });
    });

    asyncTest('Set with object', 1, function () {
        require(['core/js/views/region'], function (Region) {
            var region = new Region({template: $.noop});

            region.set({'foo': 2});
            strictEqual(region.get('foo'), 2, 'foo should have changed');

            start();
        });
    });

    asyncTest('Set with object with multiple properties', 2, function () {
        require(['core/js/views/region'], function (Region) {
            var region = new Region({template: $.noop}),
                testRegions = { x:1, y:2 };

            region.set(testRegions);
            notStrictEqual(region.regions, testRegions, 'region.regions is not a clone of testRegions');
            deepEqual(region.regions, testRegions, 'region.regions is deep equal to testRegions');

            start();
        });
    });

    asyncTest('Set value regardless of equality', 1, function () {
        require(['core/js/views/region'], function (Region) {
            var region = new Region({regions: {x: []}}),
                a = [];
            region.set('x', a);
            strictEqual(region.get('x'), a);
            start();
        });
    });

    asyncTest('Set undefined value', 1, function () {
        require(['core/js/views/region'], function (Region) {
            var region = new Region({regions: {x: undefined}});
            ok(_.has(region.regions, 'x'));
            start();
        });
    });

    asyncTest('Set with render option', function () {
        require(['core/js/views/region'], function (Region) {
            var region = new Region({ template: $.noop }),
                called = {
                    render: 0,
                    _partialRender: 0
                },
                options = {render: true};

            _.each(_.keys(called), function (key) {
                region[key] = function () {
                    called[key] += 1;
                    return Region.prototype[key].apply(region, arguments);
                };
            });

            region.set({x: 1, y: 1}, options);
            deepEqual(called, {
                render: 1,
                _partialRender: 0
            }, 'Change caused full render');

            region.set({x: 1}, options);
            deepEqual(called, {
                render: 1,
                _partialRender: 0
            }, 'No change, no partial/full render');

            region.set({x: 2}, options);
            deepEqual(called, {
                render: 1,
                _partialRender: 1
            }, 'Change caused partial render');

            start();
        });
    });

    asyncTest('Unset', 1, function () {
        require(['core/js/views/region'], function (Region) {
            var region = new Region({template: $.noop, regions: {'foo': 1}});

            region.unset('foo');
            strictEqual(region.get('foo'), void 0, 'foo should have changed');

            start();
        });
    });

    asyncTest('Clear', 1, function () {
        require(['core/js/views/region'], function (Region) {
            var region = new Region({template: $.noop, regions: {'foo': 1}});

            region.clear();
            strictEqual(region.get('foo'), void 0, 'foo should have been unset');

            start();
        });
    });

    asyncTest('Render', 2, function () {
        require(['core/js/views/region'], function (Region) {
            var region = new Region({
                    template: _.template('<div id="foo"></div><div id="view"></div>'),
                    regions: {
                        '#foo': 'bar',
                        '#view': { $el: 'test', isClosed: false }
                    }
                });

            region.render();
            strictEqual(region.$('#foo').html(), 'bar');
            strictEqual(region.$('#view').html(), 'test');

            start();
        });
    });
});
