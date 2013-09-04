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
                var called = 0, args,
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
                    args,
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
                    args,
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

                // initRegions calls addRegions
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

                // initRegions calls addRegions
                strictEqual(layout.regionManager.length, 2, 'this.regionManager now has 2 regions');
                deepEqual(layout.regionManager.keys(), _.keys(regions), 'this.regionManager has correct region names');
                
                start();
            }
        );
    });
});
