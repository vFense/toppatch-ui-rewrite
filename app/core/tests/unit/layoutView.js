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
});
