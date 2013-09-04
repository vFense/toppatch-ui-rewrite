$(document).ready(function () {
    'use strict';
    module('Region', {
        setup: function () {
            this.testID = 'testRegion';
            this.testSelector = '#' + this.testID;
            this.testRegion = $('<div></div>').attr('id', this.testID).appendTo('body');

        },
        teardown: function () {
            this.testRegion.remove();
        }
    });

    asyncTest('constructor with no arguments', function () {
        require(
            ['core/js/region'],
            function (BaseRegion) {
                QUnit.throws(function () {
                    return new BaseRegion();
                }, Error, 'New BaseRegion with no arguments threw an Error');
                start();
            }
        );
    });

    asyncTest('constructor with string', function () {
        require(
            ['core/js/region'],
            function (BaseRegion) {
                var selector = 'body',
                    region = new BaseRegion(selector);
                strictEqual(region.el, selector, 'String argument correctly copied to region.el');

                ok(_.isUndefined(region.$el), 'region.$el is undefined after default construction');

                start();
            }
        );
    });

    asyncTest('constructor with empty object', function () {
        require(
            ['core/js/region'],
            function (BaseRegion) {
                var selector = {};
                QUnit.throws(function () {
                    return new BaseRegion(selector);
                }, Error, 'New BaseRegion with an object that does not define \'el\' threw an Error');
                start();
            }
        );
    });

    asyncTest('constructor with object', function () {
        require(
            ['core/js/region'],
            function (BaseRegion) {
                var selector = { el: 'body' },
                    region = new BaseRegion(selector);
                deepEqual(region.options, {},
                    'New BaseRegion with object that defines \'el\' correctly omitted \'el\' from region.options'
                );
                strictEqual(region.el, selector.el,
                    'New BaseRegion with object that defines \'el\' correctly copied object.el to region.el'
                );
                start();
            }
        );
    });

    asyncTest('extend: set el, and initialize method', function () {
        require(
            ['core/js/region'],
            function (BaseRegion) {
                var Region, region,
                    initializeCalled = false,
                    optionsPassed = false;
                Region = BaseRegion.extend({
                    el: 'body',
                    initialize: function (options) {
                        initializeCalled = true;
                        optionsPassed = options;
                    }
                });
                region = new Region({ test: true });

                ok(true, 'new Region() did not throw error when el is defined by Region.extend');
                strictEqual(region.el, 'body', 'region.el was set by the extended Region');
                ok(_.isFunction(region.initialize), 'region.initialize was set by the extended Region');
                ok(initializeCalled, 'Constructor called our initialize method');
                ok(_.isObject(optionsPassed) && optionsPassed.test === true,
                    'Constructor passed our options to initialize method'
                );

                start();
            }
        );
    });

    asyncTest('getEl', function () {
        require(
            ['core/js/region'],
            function (BaseRegion) {
                var Region = BaseRegion.extend({
                        el: 'body'
                    }),
                    region = new Region(),
                    selector,
                    result;

                result = region.getEl(region.el);
                ok(result instanceof $, 'getEl returned an instance of Backbone.$');
                strictEqual(result[0], $(region.el)[0], 'getEl selected the correct element');

                start();
            }
        );
    });

    asyncTest('ensureEl', function () {
        require(
            ['core/js/region'],
            function (BaseRegion) {
                var selector = 'body',
                    Region = BaseRegion.extend({
                        el: selector
                    }),
                    region = new Region(),
                    result;

                // override region.getEl to see if it gets called
                var called = 0;
                region.getEl = function() {
                    called += 1;
                };

                result = region.ensureEl();
                strictEqual(result, region, 'region.ensureEl() returned region');
                strictEqual(called, 1, 'region.getEl was called because region.$el is not an instance of Backbone.$');

                ok(region.$el = $(), 'Manually set region.$el to an instance of Backbone.$, but selected nothing');

                region.ensureEl();
                strictEqual(called, 2, 'region.getEl was called again because region.$el.length === 0');

                start();
            }
        );
    });

    asyncTest('open', function () {
        var suite = this;
        require(
            ['core/js/region'],
            function (BaseRegion) {
                var Region = BaseRegion.extend({
                        el: suite.testSelector
                    }),
                    region = new Region(),
                    view = new Backbone.View(),
                    result;

                region.ensureEl();
                result = region.open(view);

                strictEqual(view.$el.parent()[0], region.$el[0],
                    'region.open(view) properly appended the view.el to region.$el'
                );
                strictEqual(result, region, 'region.open() returned region');

                start();
            }
        );
    });

    asyncTest('close', function () {
        var suite = this;
        require(
            ['core/js/region', 'core/js/view'],
            function (BaseRegion, BaseView) {
                var Region = BaseRegion.extend({
                        el: suite.testSelector
                    }),
                    region = new Region(),
                    backboneView = new Backbone.View(),
                    baseView = new BaseView(),
                    result;

                // set region.currentView to ''
                region.currentView = '';

                // Since currentView is not an instance of Backbone.View,
                // close should not delete currentView
                result = region.close();
                strictEqual(region.currentView, '', 'region.close() only operates on instances of Backbone.View');
                strictEqual(result, region, 'region.close() returned region');


                region.currentView = backboneView;
                region.ensureEl().open(region.currentView);
                region.close();
                strictEqual(backboneView.$el.parents().length, 0, 'region.close removed the backboneView from the DOM');
                ok(_.isUndefined(region.currentView), 'region.close correctly deleted the currentView reference');

                region.currentView = baseView;
                region.ensureEl().open(region.currentView);
                region.close();
                strictEqual(backboneView.$el.parents().length, 0, 'region.close removed the baseView from the DOM');
                ok(_.isUndefined(region.currentView), 'region.close correctly deleted the currentView reference');

                start();
            }
        );
    });

    asyncTest('reset', function () {
        var suite = this;
        require(
            ['core/js/region'],
            function (BaseRegion) {
                var called = 0,
                    Region = BaseRegion.extend({
                        el: suite.testSelector,
                        close: function () {
                            called += 1;
                        }
                    }),
                    region = new Region(),
                    result;

                region.ensureEl();
                result = region.reset();

                strictEqual(called, 1, 'region.reset() called close once');
                ok(_.isUndefined(region.$el), 'region.reset() correctly deleted the $el reference');
                strictEqual(result, region, 'region.reset() returned region');

                start();
            }
        );
    });

    asyncTest('show', function () {
        var suite = this;
        require(
            ['core/js/region', 'core/js/view'],
            function (BaseRegion, BaseView) {
                var Region = BaseRegion.extend({
                        el: suite.testSelector
                    }),
                    region = new Region(),
                    backboneView = new Backbone.View(),
                    baseView = new BaseView(),
                    result;

                QUnit.throws(function () { region.show(); }, TypeError,
                    'region.show() called with no arguments throws a TypeError'
                );

                QUnit.throws(function () { region.show({}); }, TypeError,
                    'region.show() called with an object that is not an instance of Backbone.View throws a TypeError'
                );

                result = region.show(backboneView);

                strictEqual(backboneView.$el.parent()[0], region.$el[0],
                    'region.show(backboneView) correctly appended backboneView to region.$el'
                );
                strictEqual(region.currentView, backboneView,
                    'region.show(backboneView) correctly set region.currentView to backboneView'
                );
                strictEqual(result, region, 'region.show(backboneView) returned region');

                result = region.show(baseView);
                strictEqual(backboneView.$el.parents().length, 0,
                    'region.show(baseView) correctly removed backboneView from the DOM'
                );
                strictEqual(baseView.$el.parent()[0], region.$el[0],
                    'region.show(baseView) correctly appended baseView to region.$el'
                );
                strictEqual(region.currentView, baseView,
                    'region.show(baseView) correctly set region.currentView to baseView'
                );
                strictEqual(result, region, 'region.show(baseView) returned region');

                // Override close to see if it gets called
                var called = 0;
                baseView.close = function () {
                    called += 1;
                };

                // Since we are passing in the same view again,
                // The view's close method should not be called
                region.show(baseView);
                strictEqual(called, 0,
                    'region.show(baseView) did not call close since baseView is already the currentView'
                );

                start();
            }
        );
    });
});
