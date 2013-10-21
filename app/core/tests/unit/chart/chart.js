$(document).ready(function () {
    'use strict';
    module('Chart');

    asyncTest('Initialize', function () {
        require(
            ['core/js/chart/chart'],
            function (Chart) {
                var chart;

                ok(chart = new Chart(), 'Initialize new Chart with no options');
                ok(_.has(chart.chartOptions, 'chart'), 'Chart options has chart key');
                ok(_.has(chart.chartOptions.chart, 'renderTo'), 'Options has renderTo key');
                strictEqual(_.result(chart.chartOptions.chart, 'renderTo'), chart.el, 'renderTo is set correctly');
                ok(_.has(chart.chartOptions, 'title'), 'Chart options has title key');
                ok(_.has(chart.chartOptions, 'credits'), 'Chart options has credits key');
                ok(_.has(chart.chartOptions, 'xAxis'), 'Chart options has xAxis key');
                ok(_.has(chart.chartOptions, 'yAxis'), 'Chart options has yAxis key');

                start();
            }
        );
    });

    asyncTest('Render', function () {
        require(
            ['core/js/chart/chart'],
            function (Chart) {
                var collection, chart;
                collection = new Backbone.Collection([
                    {
                        name: 'Tokyo',
                        data: [7]
                    }
                ]);

                ok(chart = new Chart({
                    collection: collection,
                }), 'Initialize new Chart with sample collection');

                ok(chart.render(), 'Render the chart');
                ok(_.has(chart.$el.data(), 'highchartsChart'), '$el.data() has highcharts-chart attribute');

                start();
            }
        );
    });

    asyncTest('_destroyChart', function () {
        require(
            ['core/js/chart/chart'],
            function (Chart) {
                var collection, chart;
                collection = new Backbone.Collection([
                    {
                        name: 'Tokyo',
                        data: [7]
                    }
                ]);
                chart = new Chart({
                    collection: collection,
                });

                chart.render();
                ok(chart._destroyChart(), 'Destroy the chart after render');
                ok(!_.has(chart.$el.data(), 'highchartsChart'), '$el.data() does not have highcharts-chart attribute');
                strictEqual(chart.$('*').length, 0, '$el is empty');

                start();
            }
        );
    });

    asyncTest('close', function () {
        require(
            ['core/js/chart/chart'],
            function (Chart) {
                var collection, chart, called;
                collection = new Backbone.Collection([
                    {
                        name: 'Tokyo',
                        data: [7]
                    }
                ]);
                chart = new Chart({
                    collection: collection,
                });

                chart.render();

                called = 0;
                chart._destroyChart = function () {
                    called += 1;
                    return Chart.prototype._destroyChart.apply(chart, arguments);
                };

                ok(chart.close(), 'Close the chart after render');

                strictEqual(called, 1, 'close method called _destroyChart');

                start();
            }
        );
    });
});
