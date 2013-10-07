$(document).ready(function () {
    'use strict';
    module('Chart');

    asyncTest('Initialize', function () {
        require(
            ['core/js/chart/chart'],
            function (Chart) {
                var chart;

                ok(chart = new Chart(), 'Initialize new Chart with no options');
                ok(_.has(chart.options, 'chart'), 'Chart options has chart key');
                ok(_.has(chart.options.chart, 'renderTo'), 'Options has renderTo key');
                strictEqual(_.result(chart.options.chart, 'renderTo'), chart.el, 'renderTo is set correctly');
                ok(_.has(chart.options, 'title'), 'Chart options has title key');
                ok(_.has(chart.options, 'credits'), 'Chart options has credits key');
                ok(_.has(chart.options, 'xAxis'), 'Chart options has xAxis key');
                ok(_.has(chart.options, 'yAxis'), 'Chart options has yAxis key');

                start();
            }
        );
    });

    asyncTest('Render', function () {
        require(
            ['core/js/chart/chart'],
            function (Chart) {
                var collection = new Backbone.Collection([
                        {
                            name: 'Tokyo',
                            data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                        }
                    ]),
                    chart;

                ok(chart = new Chart({
                    collection: collection,
                }), 'Initialize new Chart with sample collection');

                ok(chart.render(), 'Render the chart');

                ok(_.has(chart.$el.data(), 'highchartsChart'), 'Highcharts instance created on chart\'s el');

                start();
            }
        );
    });
});
