$(document).ready(function () {
    'use strict';
    module('Region');
    asyncTest('Constructor', function () {
        require(['core/js/views/region'], function (Region) {
            var region = new Region({template: _.template('<div id="test"></div>')});
            ok(region instanceof Region, 'Created instance of region');
            ok(region.regions instanceof Backbone.Model, 'Regions initialized');
            region.regions.set({'#test': 'test'});
            strictEqual(region.$('#test').html(), 'test', 'Render gets called when this.regions has a change');
            start();
        });
    });
    asyncTest('getData', function () {
        require(['core/js/views/region'], function (Region) {
            var region = new Region({template: _.template('<div id="test"></div>')}),
                regions = {'#test': 'test'};
            region.regions.set(regions);
            deepEqual(region.getData(), regions, 'getData returns regions');
            start();
        });
    });
});