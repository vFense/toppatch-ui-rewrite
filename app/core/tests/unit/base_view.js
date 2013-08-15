$(document).ready(function () {
    "use strict";
    module('base_view', {
        setup: function () {
            this.invalidTypes = function () {
                return {
                    "string": "",
                    "number": 1,
                    "function": function () {},
                    "array": [],
                    "object": {},
                    "boolean": true,
                    "undefined": undefined,
                    "null": null,
                    "Backbone.Collection": new Backbone.Collection(),
                    "Backbone.Model": new Backbone.Model(),
                    "Backbone.Router": new Backbone.Router()
                };
            };
        }
    });
    asyncTest("new base_view()", function () {
        require(['base_view'], function() {
            ok(true, 'Attempt new view()');
            var view = new (require('base_view'))();
            ok(_.isUndefined(view.children), 'view.children is undefined');

            start();
        });
    });
    asyncTest("base_view._initChildServices", function () {
        require(['base_view'], function() {
            var view = new (require('base_view'))(),
                result;

            ok(true, 'Attempt view._initChildServices()');
            result = view._initChildServices();
            strictEqual(result, view, 'Returned this');
            ok(view.children instanceof Backbone.ChildViewContainer, 'Set view.children to instance of Backbone.ChildViewContainer');

            start();
        });
    });
    asyncTest("base_view.registerChildView() [no arguments]", function () {
        require(['base_view'], function() {
            var view = new (require('base_view'))(),
                result;

            // registerChildView with no args
            ok(true, 'Attempt view.registerChildView() with no args');
            result = view.registerChildView();
            strictEqual(result, view, 'Returned this');
            ok(_.isUndefined(view.children), 'view.children remains undefined');

            start();
        });
    });
    asyncTest("base_view.registerChildView() [invalid type]", function () {
        var that = this;
        require(['base_view'], function() {
            var view = new (require('base_view'))(),
                invalidTypes = that.invalidTypes();

            _.each(invalidTypes, function (value, key) {
                ok(true, 'attempt view.registerChildView(' + key + ')');
                var result = view.registerChildView(value);
                strictEqual(result, view, 'Returned this');
                ok(_.isUndefined(view.children), 'Successfully filtered ' + key + ' type');
            });

            start();
        });
    });
    asyncTest("base_view.registerChildView() [multiple invalid types at once]", function () {
        var that = this;
        require(['base_view'], function() {
            var view = new (require('base_view'))(),
                invalidTypes = that.invalidTypes(),
                result;

            ok(true, 'Attempt view.registerChildView() with multiple arguments');
            result = view.registerChildView.apply(view, _.values(invalidTypes));
            strictEqual(result, view, 'Returned this');
            ok(_.isUndefined(view.children), 'Successfully filtered all invalid arguments');

            start();
        });
    });
    asyncTest("base_view.registerChildView() [reference to itself]", function () {
        require(['base_view'], function() {
            var view = new (require('base_view'))(),
                result;

            ok(true, 'Attempt view.registerChildView() with view as an argument');
            result = view.registerChildView(view);
            strictEqual(result, view, 'Returned this');
            ok(_.isUndefined(view.children), 'Successfully filtered reference to itself');

            start();
        });
    });
    asyncTest("base_view.registerChildView() [new Backbone.View and new base_view]", function () {
        require(['base_view'], function() {
            var view = new (require('base_view'))(),
                newBackboneView = new Backbone.View(),
                newBaseView = new (require('base_view'))(),
                result;

            // registerChild test
            ok(true, 'Attempt view.registerChildView() with a new Backbone.View');
            result = view.registerChildView(newBackboneView);
            strictEqual(result, view, 'Returned this');
            ok(!_.isUndefined(view.children), 'view.children is defined');
            strictEqual(view.children.length, 1, 'view has 1 child');
            strictEqual(view.children.findByCid(newBackboneView.cid), newBackboneView, 'newBackboneView is in view.children');

            ok(true, 'Attempt view.registerChildView() with a new base_view');
            result = view.registerChildView(newBaseView);
            strictEqual(result, view, 'Returned this');
            strictEqual(view.children.length, 2, 'view has 2 children');
            strictEqual(view.children.findByCid(newBaseView.cid), newBaseView, 'newBaseView is in view.children');
            start();
        });
    });
    asyncTest("base_view.registerChildView() [multiple Backbone.Views at once]", function () {
        require(['base_view'], function() {
            var view = new (require('base_view'))(),
                result;

            ok(true, 'Attempt view.registerChildView() with multiple new Backbone.View');
            result = view.registerChildView(new Backbone.View(), new Backbone.View(), new Backbone.View());
            strictEqual(result, view, 'Returned this');
            ok(!_.isUndefined(view.children), 'view.children is defined');
            strictEqual(view.children.length, 3, 'view has 3 children');
            strictEqual(_.uniq(view.children._views).length, 3, 'Each child is unique');
            start();
        });
    });
    asyncTest("base_view.closeChildView() [invalid arguments]", function () {
        var that = this;
        require(['base_view'], function() {
            var view = new (require('base_view'))(),
                invalidTypes = that.invalidTypes();

            view.registerChildView(new Backbone.View(), new Backbone.View(), new Backbone.View());
            strictEqual(_.uniq(view.children._views).length, 3, 'Start with a view that has 3 unique children');

            _.each(invalidTypes, function (value, key) {

                ok(true, 'Attempt view.closeChildView(' + key + ')');
                var result = view.closeChildView(value);
                strictEqual(result, view, 'Returned this');
                strictEqual(view.children.length, 3, 'view still has 3 children');
            });

            start();
        });
    });
    asyncTest("base_view.closeChildView()", function () {
        require(['base_view'], function() {
            var view = new (require('base_view'))(),
                childView1 = new Backbone.View(),
                childView2 = new (require('base_view'))(),
                result;

            view.registerChildView(childView1, childView2);
            strictEqual(view.children.length, 2, 'Start with a view that has 2 children');

            ok(true, 'Attempt view.closeChildView() with childView1 reference');
            result = view.closeChildView(childView1);
            strictEqual(result, view, 'Returned this');
            strictEqual(view.children.length, 1, 'view has 1 children');

            ok(true, 'Attempt view.closeChildView() with childView2 reference');
            result = view.closeChildView(childView2);
            strictEqual(result, view, 'Returned this');
            strictEqual(view.children.length, 0, 'view has 0 child');

            start();
        });
    });
    asyncTest("base_view.closeChildViews()", function () {
        require(['base_view'], function() {
            var view = new (require('base_view'))(),
                childView1 = new Backbone.View(),
                childView2 = new (require('base_view'))(),
                result;

            view.registerChildView(childView1, childView2);
            strictEqual(view.children.length, 2, 'Start with a view that has 2 children');

            ok(true, 'Attempt view.closeChildViews()');
            result = view.closeChildViews();
            strictEqual(result, view, 'Returned this');
            strictEqual(view.children.length, 0, 'view has 0 children');

            start();
        });
    });
    asyncTest("base_view.close() [No child views]", function () {
        require(['base_view'], function() {
            var beforeCloseCalled = false,
                isClosingSet = false,
                $body = $('body'),
                View = require('base_view').extend({
                    beforeClose: function () {
                        beforeCloseCalled = true;
                        isClosingSet = this.isClosing;
                    }
                }),
                view = new View();

            ok(true, 'New view has been created');

            view.$el.appendTo($body);
            strictEqual(view.$el.parent()[0], $body[0], 'view appended to body');

            ok(true, 'Attempting view.close()');
            var result = view.close();
            ok(beforeCloseCalled, 'view.close() called this.beforeClose');
            strictEqual(view.$el.parent()[0], undefined, 'view has been removed from the body');
            strictEqual(isClosingSet, true, 'view.isClosing was set to true during the view.close process');
            strictEqual(view.isClosing, false, 'view.isClosing was set to false upon view.close completion');
            strictEqual(result, view, 'view.close returned view');

            start();
        });
    });
    asyncTest("base_view.close() [Circular reference]", function () {
        var $body = $('body'),
            View = require('base_view'),
            mainView = new View(),
            childView = new (require('base_view'))();


        mainView.registerChildView(childView);
        childView.registerChildView(mainView);
        ok(true, '[mainView] has child [childView]');
        ok(true, '[childView] has child [mainView]');
        ok(true, 'Close method should prevent infinite loop');
        ok(true, 'Attempting mainVIew.close()');
        mainView.close();
        ok('true', 'Close method prevented infinite loop');

        start();
    });
});
