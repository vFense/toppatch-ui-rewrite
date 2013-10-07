define(
    ['core/js/view', 'highcharts'],
    function (View, Highcharts) {
        'use strict';
        var backboneViewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];
        return View.extend({
            defaultOptions: {
                chart:  { style: { width: '100%', height: '100%' } },
                title:  { text: '' },
                credits:{ enabled: false },
                xAxis:  { showLastLabel: true },
                yAxis:  { title: { text: '' } }
            },
            /**
             * Initialize this view, and set the Highcharts renderTo property to this.el
             * @method initialize
             * @param options {Object} Options to pass to the new Highcharts instance
             * @chainable
             */
            initialize: function (options) {
                this.options = _.merge({}, this.defaultOptions, _.omit(options, backboneViewOptions));
                this.options.chart.renderTo = this.el;
                return this;
            },
            /**
             * Create a new instance of a Highaharts chart which will append itself to this.el.
             *
             * Note: The chart cannot take on 100% height/width unless this.el is in the DOM.
             * Re-rendering after append will correct the height and width to 100%.
             * @method render
             * @chainable
             */
            render: function () {
                _.result(this.chart, 'destroy');
                this.options.series = _.result(this.collection, 'toJSON');
                this.chart = new Highcharts.Chart(this.options);
                return this;
            }
        });
    }
);
