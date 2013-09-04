$(document).ready(function () {
    'use strict';
    module('LayoutView');

    asyncTest('Constructor [no regions]', function () {
        require(
            ['core/js/layoutView'],
            function (LayoutView) {
                var called = 0,
                    Layout = LayoutView.extend({
                        _initRegions: function () {
                            called += 1;
                            return this;
                        }
                    }),
                    layout = new Layout();

                // new calls constructor
                strictEqual(called, 1, 'Called _initRegions');
                strictEqual(layout._firstRender, true, 'Set _firstRender to true');

                start();
            }
        );
    });

    asyncTest('_initRegions [on construct, no regions]', function () {
        require(
            ['core/js/layoutView'],
            function (LayoutView) {
                var called = 0,
                    Layout = LayoutView.extend({
                        addRegions: function () {
                            called += 1;
                            return this;
                        }
                    }),
                    layout;
                layout = new Layout();

                // Constructor calls _initRegions
                ok(!_.isUndefined(layout.regionManager), 'Defined this.regionManager');
                strictEqual(called, 0, '_initRegions should not call addRegions in this case');

                start();
            }
        );
    });

    asyncTest('_initRegions [on construct, with regions]', function () {
        require(
            ['core/js/layoutView'],
            function (LayoutView) {
                var called = 0,
                    args = [],
                    Layout = LayoutView.extend({
                        regions: {
                            regionOne: '#regionOne',
                            regionTwo: '#regionTwo'
                        },
                        addRegions: function () {
                            called += 1;
                            args = _.toArray(arguments);
                            return this;
                        }
                    }),
                    layout = new Layout();

                // Constructor calls _initRegions
                ok(!_.isUndefined(layout.regionManager), 'Defined this.regionManager');
                strictEqual(called, 1, 'addRegions should be called in this case');
                deepEqual(args, [layout.regions], 'Passed this.regions to addRegions');

                start();
            }
        );
    });

    asyncTest('addRegions [on construct, with regions]', function () {
        require(
            ['core/js/layoutView'],
            function (LayoutView) {
                var called = 0,
                    args = [],
                    regions = {
                        regionOne: '#regionOne',
                        regionTwo: '#regionTwo'
                    },
                    Layout = LayoutView.extend({
                        regions: regions,
                        _buildRegions: function () {
                            called += 1;
                            args = _.toArray(arguments);
                            return this;
                        }
                    }),
                    layout;
                layout = new Layout();

                // initRegions calls addRegions
                notStrictEqual(layout.regions, regions, 'Rebuilt this.regions');
                deepEqual(layout.regions, regions, 'this.regions is correct');
                strictEqual(called, 1, 'Called _buildRegions');
                strictEqual(args.length, 1, 'Passed one argument to _buildRegions');
                strictEqual(args[0], regions, 'Passed argument "regions" to _buildRegions');

                start();
            }
        );
    });

    asyncTest('addRegions [post construct]', function () {
        require(
            ['core/js/layoutView'],
            function (LayoutView) {
                var called = 0,
                    args = [],
                    regions = {
                        regionOne: '#regionOne',
                        regionTwo: '#regionTwo'
                    },
                    Layout = LayoutView.extend({
                        regions: regions,
                        _buildRegions: function () {
                            called += 1;
                            args = _.toArray(arguments);
                            return this;
                        }
                    }),
                    layout;
                layout = new Layout();

                called = 0;
                args = undefined;

                var testRegion = {
                    regionThree: '#regionThree'
                };
                layout.addRegions(testRegion);

                notStrictEqual(layout.regions, regions, 'Rebuilt this.regions');
                deepEqual(layout.regions, _.extend({}, regions, testRegion), 'this.regions is correct');
                strictEqual(called, 1, 'Called _buildRegions');
                strictEqual(args.length, 1, 'Passed one argument to _buildRegions');
                strictEqual(args[0], testRegion, 'Passed the testRegion to _buildRegions');

                start();
            }
        );
    });

    asyncTest('_buildRegions [on construct, with regions]', function () {
        require(
            ['core/js/layoutView'],
            function (LayoutView) {
                var regions = {
                        regionOne: '#regionOne',
                        regionTwo: '#regionTwo'
                    },
                    Layout = LayoutView.extend({
                        regions: regions
                    }),
                    layout;
                layout = new Layout();

                strictEqual(layout.regionManager.length, 2, 'this.regionManager now has 2 regions');

                _.each(regions, function (value, key) {
                    var manager = layout.regionManager;
                    ok(manager.has(key), 'this.regionManager has ' + key);
                    var region = layout.regionManager.get(key);
                    strictEqual(region.el, value, key + '\'s el is correct');
                    ok(_.isFunction(region.parentEl), key + '\'s parentEl is a function');
                    strictEqual(region.parentEl(), layout.$el, key + '\'s parentEl evaluates to layout\'s $el');
                });

                start();
            }
        );
    });

    asyncTest('addRegion [definition is string]', function () {
        require(
            ['core/js/layoutView'],
            function (LayoutView) {
                var layout = new LayoutView();

                layout.addRegion('regionOne', '#regionOne');
                deepEqual(layout.regions, {'regionOne': '#regionOne'}, 'this.regions is correct');
                strictEqual(layout.regionManager.length, 1, 'this.regionManager now has 1 region');
                deepEqual(layout.regionManager.keys(), ['regionOne'], 'this.regionManager has correct region names');

                // Duplicate region name to ensure region overwrite
                layout.addRegion('regionOne', '#regionOne');
                deepEqual(layout.regions, {'regionOne': '#regionOne'}, 'this.regions is correct');
                strictEqual(layout.regionManager.length, 1, 'this.regionManager now has 1 region');
                deepEqual(layout.regionManager.keys(), ['regionOne'], 'this.regionManager has correct region names');

                layout.addRegion('regionTwo', '#regionTwo');
                deepEqual(layout.regions, {'regionOne': '#regionOne', 'regionTwo': '#regionTwo'}, 'this.regions is correct');
                strictEqual(layout.regionManager.length, 2, 'this.regionManager now has 2 regions');
                deepEqual(layout.regionManager.keys(), ['regionOne', 'regionTwo'], 'this.regionManager has correct region names');

                start();
            }
        );
    });

    asyncTest('removeRegion', function () {
        require(
            ['core/js/layoutView'],
            function (LayoutView) {
                var layout = new LayoutView(),
                    regions = {
                        'regionOne': '#regionOne',
                        'regionTwo': '#regionTwo'
                    };
                layout.addRegions(regions);

                layout.removeRegion('regionOne');
                deepEqual(layout.regions, {'regionTwo': '#regionTwo'}, 'this.regions is correct');
                strictEqual(layout.regionManager.length, 1, 'this.regionManager now has 1 region');
                deepEqual(layout.regionManager.keys(), ['regionTwo'], 'this.regionManager has correct region names');

                // Duplicate removeRegion call to test for possible error
                ok(layout.removeRegion('regionOne'), 'Did not throw an exception');

                layout.removeRegion('regionTwo');
                deepEqual(layout.regions, {}, 'this.regions is correct');
                strictEqual(layout.regionManager.length, 0, 'this.regionManager now has 0 regions');

                start();
            }
        );
    });

    asyncTest('getRegion', function () {
        require(
            ['core/js/layoutView'],
            function (LayoutView) {
                var layout = new LayoutView(),
                    regions = {
                        'regionOne': '#regionOne',
                        'regionTwo': '#regionTwo'
                    };
                layout.addRegions(regions);

                var regionOne = layout.regionManager.get('regionOne'),
                    result = layout.getRegion('regionOne');

                strictEqual(result, regionOne, 'returned the correct region');

                start();
            }
        );
    });

    asyncTest('Render [first call]', function () {
        require(
            ['core/js/layoutView'],
            function (LayoutView) {
                var Layout, layout;
                Layout = LayoutView.extend({
                    template: _.template('<div id="regionOne"></div><div id="regionTwo"></div>'),
                    regions: {
                        regionOne: '#regionOne',
                        regionTwo: '#regionTwo'
                    }
                });
                layout = new Layout();

                var callCounts = {};
                _.each(_.functions(layout), function (key) {
                    callCounts[key] = 0;
                    var wrappedMethod = layout[key];
                    layout[key] = function () {
                        callCounts[key] += 1;
                        return wrappedMethod.apply(layout, arguments);
                    };
                });

                layout.render();
                strictEqual(layout._firstRender, false, 'Render set _firstRender to false');
                strictEqual(callCounts._initRegions, 0, 'Render did not call _initRegions');
                strictEqual(callCounts._reInitRegions, 0, 'Render did not call _reInitRegions');

                var regionOne = layout.getRegion('regionOne'),
                    $el = layout.$('#regionOne');
                regionOne.ensureEl();
                strictEqual(regionOne.$el[0], $el[0], 'regionOne found element within rendered template');

                start();
            }
        );
    });

    asyncTest('Render [second call]', function () {
        require(
            ['core/js/layoutView'],
            function (LayoutView) {
                var Layout, layout;
                Layout = LayoutView.extend({
                    template: _.template('<div id="regionOne"></div><div id="regionTwo"></div>'),
                    regions: {
                        regionOne: '#regionOne',
                        regionTwo: '#regionTwo'
                    }
                });
                layout = new Layout();
                layout.render();

                var callCounts = {};
                _.each(_.functions(layout), function (key) {
                    callCounts[key] = 0;
                    var wrappedMethod = layout[key];
                    layout[key] = function () {
                        callCounts[key] += 1;
                        return wrappedMethod.apply(layout, arguments);
                    };
                });

                layout.render();
                strictEqual(callCounts._initRegions, 0, 'Render did not call _initRegions');
                strictEqual(callCounts._reInitRegions, 1, 'Render called _reInitRegions');

                start();
            }
        );
    });

    asyncTest('close', function () {
        require(
            ['core/js/layoutView'],
            function (LayoutView) {
                var Layout = LayoutView.extend({
                        regions: {
                            regionOne: '#regionOne',
                            regionTwo: '#regionTwo'
                        }
                    }),
                    layout = new Layout();
                layout.close();
                strictEqual(layout.regionManager.length, 0, 'closed regionManager');
                strictEqual(layout.isClosed, true, 'isClosed');

                var called = 0;
                layout.regionManager.close = function () {
                    called += 1;
                };
                layout.close();
                strictEqual(called, 0, 'Calling close, when already closed, does not call regionManager.close');

                start();
            }
        );
    });
});
