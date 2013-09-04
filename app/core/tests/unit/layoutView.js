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
});
