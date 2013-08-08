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
        require(['base_view'], function(View) {
            ok(true, 'Attempt new view()');
            var view = new View();
            ok(true, 'Ran without exception');
            strictEqual(view.__super__, Backbone.View.prototype, 'view.__super__ points to Backbone.View.prototype');
            ok(_.isUndefined(view.children), 'view.children is undefined');

            start();
        });
    });
    asyncTest("base_view._initChildServices", function () {
        require(['base_view'], function(View) {
            var view = new View(),
                result;

            ok(true, 'Attempt _initChildServices()');
            result = view._initChildServices();
            ok(true, 'Ran without exception');
            strictEqual(result, view, 'Returned this');
            ok(view.children instanceof Backbone.ChildViewContainer, 'Set view.children to instance of Backbone.ChildViewContainer');

            start();
        });
    });
    asyncTest("base_view.registerChildView() [no arguments]", function () {
        require(['base_view'], function(View) {
            var view = new View(),
                result;

            // registerChildView with no args
            ok(true, 'Attempt registerChildView() with no args');
            result = view.registerChildView();
            ok(true, 'Ran without exception');
            strictEqual(result, view, 'Returned this');
            ok(_.isUndefined(view.children), 'view.children remains undefined');

            start();
        });
    });
    asyncTest("base_view.registerChildView() [invalid type]", function () {
        var that = this;
        require(['base_view'], function(View) {
            var view = new View(),
                invalidTypes = that.invalidTypes();

            _.each(invalidTypes, function (value, key) {
                ok(true, 'attempt registerChildView(' + key + ')');
                var result = view.registerChildView(value);
                ok(true, 'Ran without exception');
                strictEqual(result, view, 'Returned this');
                ok(_.isUndefined(view.children), 'Successfully filtered ' + key + ' type');
            });

            start();
        });
    });
    asyncTest("base_view.registerChildView() [multiple invalid types at once]", function () {
        var that = this;
        require(['base_view'], function(View) {
            var view = new View(),
                invalidTypes = that.invalidTypes(),
                result;

            ok(true, 'Attempt to add multiple invalid types at once');
            result = view.registerChildView.apply(view, _.values(invalidTypes));
            ok(true, 'Ran without exception');
            strictEqual(result, view, 'Returned this');
            ok(_.isUndefined(view.children), 'Successfully filtered all invalid arguments');

            start();
        });
    });
    asyncTest("base_view.registerChildView() [reference to itself]", function () {
        require(['base_view'], function(View) {
            var view = new View(),
                result;

            ok(true, 'Attempt to add reference to view');
            result = view.registerChildView(view);
            ok(true, 'Ran without exception');
            strictEqual(result, view, 'Returned this');
            ok(_.isUndefined(view.children), 'Successfully filtered reference to itself');

            start();
        });
    });
    asyncTest("base_view.registerChildView() [new Backbone.View and new base_view]", function () {
        require(['base_view'], function(View) {
            var view = new View(),
                newBackboneView = new Backbone.View(),
                newBaseView = new View(),
                result;

            // registerChild test
            ok(true, 'Attempt to add newBackboneView');
            result = view.registerChildView(newBackboneView);
            ok(true, 'Ran without exception');
            strictEqual(result, view, 'Returned this');
            ok(!_.isUndefined(view.children), 'view.children is defined');
            strictEqual(view.children.length, 1, 'view has 1 child');
            strictEqual(view.children.findByCid(newBackboneView.cid), newBackboneView, 'newBackboneView is in view.children');

            ok(true, 'Attempt to add newBaseView');
            result = view.registerChildView(newBaseView);
            ok(true, 'Ran without exception');
            strictEqual(result, view, 'Returned this');
            strictEqual(view.children.length, 2, 'view has 2 children');
            strictEqual(view.children.findByCid(newBaseView.cid), newBaseView, 'newBaseView is in view.children');
            start();
        });
    });
    asyncTest("base_view.registerChildView() [multiple Backbone.Views at once]", function () {
        require(['base_view'], function(View) {
            var view = new View(),
                result;

            ok(true, 'Attempt to add 3 new Backbone.View');
            result = view.registerChildView(new Backbone.View(), new Backbone.View(), new Backbone.View());
            ok(true, 'Ran without exception');
            strictEqual(result, view, 'Returned this');
            ok(!_.isUndefined(view.children), 'view.children is defined');
            strictEqual(view.children.length, 3, 'view has 3 children');
            strictEqual(_.uniq(view.children._views).length, 3, 'Each child is unique');
            start();
        });
    });
    asyncTest("base_view.closeChildView() [invalid arguments]", function () {
        var that = this;
        require(['base_view'], function(View) {
            var view = new View(),
                invalidTypes = that.invalidTypes();

            view.registerChildView(new Backbone.View(), new Backbone.View(), new Backbone.View());
            strictEqual(_.uniq(view.children._views).length, 3, 'Start with a view that has 3 unique children');

            _.each(invalidTypes, function (value, key) {

                ok(true, 'Attempt closeChildView(' + key + ')');
                var result = view.closeChildView(value);
                ok(true, 'Ran without exception');
                strictEqual(result, view, 'Returned this');
                strictEqual(view.children.length, 3, 'view still has 3 children');
            });

            start();
        });
    });
    asyncTest("base_view.closeChildView()", function () {
        require(['base_view'], function(View) {
            var view = new View(),
                childView1 = new Backbone.View(),
                childView2 = new Backbone.View(),
                childView3 = new Backbone.View(),
                result;

            view.registerChildView(childView1, childView2, childView3);
            strictEqual(view.children.length, 3, 'Start with a view that has 3 children');

            ok(true, 'Attempt to remove a childView');
            result = view.closeChildView(childView1);
            ok(true, 'Ran without exception');
            strictEqual(result, view, 'Returned this');
            strictEqual(view.children.length, 2, 'view has 2 children');

            ok(true, 'Attempt to remove a childView');
            result = view.closeChildView(childView2);
            ok(true, 'Ran without exception');
            strictEqual(result, view, 'Returned this');
            strictEqual(view.children.length, 1, 'view has 1 child');

            ok(true, 'Attempt to remove a childView');
            result = view.closeChildView(childView3);
            ok(true, 'Ran without exception');
            strictEqual(result, view, 'Returned this');
            strictEqual(view.children.length, 0, 'view has 0 children');

            start();
        });
    });
    asyncTest("base_view.closeChildViews()", function () {
        require(['base_view'], function(View) {
            var view = new View(),
                childView1 = new Backbone.View(),
                childView2 = new Backbone.View(),
                childView3 = new Backbone.View(),
                result;

            view.registerChildView(childView1, childView2, childView3);
            strictEqual(view.children.length, 3, 'Start with a view that has 3 children');

            ok(true, 'Attempt to close all child views');
            result = view.closeChildViews();
            ok(true, 'Ran without exception');
            strictEqual(result, view, 'Returned this');
            strictEqual(view.children.length, 0, 'view has 0 children');

            start();
        });
    });
    asyncTest("base_view.close() [No child views]", function () {
        require(['base_view'], function(View) {
            var beforeCloseCalled = false,
                $body = $('body');

            View = View.extend({
                beforeClose: function () {
                    beforeCloseCalled = true;
                }
            });

            var view = new View();
            ok(true, 'New view has been created');

            view.$el.appendTo($body);
            strictEqual(view.$el.parent()[0], $body[0], 'view appended to body');

            ok(true, 'Attempting view.close()');
            var result = view.close();
            ok(beforeCloseCalled, 'view.close() called this.beforeClose');
            strictEqual(view.$el.parent()[0], undefined, 'view has been removed from the body');
            strictEqual(result, view, 'view.close returned view');

            start();
        });
    });
});
