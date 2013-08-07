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
            ok(true, 'Attempt new base_view()');
            var base_view = new View();
            ok(base_view.__super__ === Backbone.View.prototype, 'base_view.__super__ points to Backbone.View.prototype');
            ok(true, 'Ran without exception');
            ok(_.isUndefined(base_view.children), 'base_view.children is undefined');

            start();
        });
    });
    asyncTest("base_view._initChildServices", function () {
        require(['base_view'], function(View) {
            var base_view = new View(),
                result;

            ok(true, 'Attempt _initChildServices()');
            result = base_view._initChildServices();
            ok(true, 'Ran without exception');
            ok(result === base_view, 'Returned this');
            ok(base_view.children instanceof Backbone.ChildViewContainer, 'Set base_view.children to instance of Backbone.ChildViewContainer');

            start();
        });
    });
    asyncTest("base_view.registerChildView() [no arguments]", function () {
        require(['base_view'], function(View) {
            var base_view = new View(),
                result;

            // registerChildView with no args
            ok(true, 'Attempt registerChildView() with no args');
            result = base_view.registerChildView();
            ok(true, 'Ran without exception');
            ok(result === base_view, 'Returned this');
            ok(_.isUndefined(base_view.children), 'base_view.children remains undefined');

            start();
        });
    });
    asyncTest("base_view.registerChildView() [invalid type]", function () {
        var that = this;
        require(['base_view'], function(View) {
            var base_view = new View(),
                invalidTypes = that.invalidTypes();

            _.each(invalidTypes, function (value, key) {
                ok(true, 'attempt registerChildView(' + key + ')');
                var result = base_view.registerChildView(value);
                ok(result === base_view, 'Returned this');
                ok(_.isUndefined(base_view.children), 'Successfully filtered ' + key + 'type');
                ok(true, 'Ran without exception');
            });

            start();
        });
    });
    asyncTest("base_view.registerChildView() [multiple invalid types at once]", function () {
        var that = this;
        require(['base_view'], function(View) {
            var base_view = new View(),
                invalidTypes = that.invalidTypes(),
                result;

            ok(result === base_view, 'Returned this');
            ok(true, 'Attempt to add multiple invalid types at once');
            result = base_view.registerChildView.apply(base_view, _.values(invalidTypes));
            ok(true, 'Ran without exception');
            ok(_.isUndefined(base_view.children), 'Successfully filtered all invalid arguments');

            start();
        });
    });
    asyncTest("base_view.registerChildView() [reference to itself]", function () {
        var that = this;
        require(['base_view'], function(View) {
            var base_view = new View(),
                result;

            ok(result === base_view, 'Returned this');
            ok(true, 'Attempt to add reference to base_view');
            result = base_view.registerChildView(base_view);
            ok(true, 'Ran without exception');
            ok(_.isUndefined(base_view.children), 'Successfully filtered reference to itself');

            start();
        });
    });
    asyncTest("base_view.registerChildView() [new Backbone.View and new base_view]", function () {
        require(['base_view'], function(View) {
            var base_view = new View(),
                newBackboneView = new Backbone.View(),
                newBaseView = new View(),
                result;

            // registerChild test
            ok(true, 'Attempt to add newBackboneView');
            result = base_view.registerChildView(newBackboneView);
            ok(true, 'Ran without exception');
            ok(!_.isUndefined(base_view.children), 'base_view.children is defined');
            strictEqual(base_view.children.length, 1, 'base_view has 1 child');
            ok(base_view.children.findByCid(newBackboneView.cid) === newBackboneView, 'newBackboneView is in base_view.children');
            result = undefined;


            ok(true, 'Attempt to add newBaseView');
            result = base_view.registerChildView(newBaseView);
            ok(true, 'Ran without exception');
            strictEqual(base_view.children.length, 2, 'base_view has 2 children');
            ok(base_view.children.findByCid(newBaseView.cid) === newBaseView, 'newBaseView is in base_view.children');
            start();
        });
    });
    asyncTest("base_view.registerChildView() [multiple Backbone.Views at once]", function () {
        require(['base_view'], function(View) {
            var base_view = new View(),
                result;

            ok(true, 'Attempt to add 3 new Backbone.View');
            result = base_view.registerChildView(new Backbone.View(), new Backbone.View(), new Backbone.View());
            ok(true, 'Ran without exception');
            ok(!_.isUndefined(base_view.children), 'base_view.children is defined');
            strictEqual(base_view.children.length, 3, 'base_view has 3 children');
            strictEqual(_.uniq(base_view.children._views).length, 3, 'Each child is unique');
            start();
        });
    });
    asyncTest("base_view.closeChildView() [invalid arguments]", function () {
        var that = this;
        require(['base_view'], function(View) {
            var base_view = new View(),
                invalidTypes = that.invalidTypes();

            base_view.registerChildView(new Backbone.View(), new Backbone.View(), new Backbone.View());
            ok(_.uniq(base_view.children._views).length === 3, 'Start with a base_view that has 3 unique children');

            _.each(invalidTypes, function (value, key) {

                ok(true, 'Attempt closeChildView(' + key + ')');
                var result = base_view.closeChildView(value);
                ok(true, 'Ran without exception');
                strictEqual(base_view.children.length, 3, 'base_view still has 3 children');
            });

            start();
        });
    });
    asyncTest("base_view.closeChildView()", function () {
        require(['base_view'], function(View) {
            var base_view = new View(),
                childView1 = new Backbone.View(),
                childView2 = new Backbone.View(),
                childView3 = new Backbone.View(),
                result;

            base_view.registerChildView(childView1, childView2, childView3);
            strictEqual(base_view.children.length, 3, 'Start with a base_view that has 3 children');

            ok(true, 'Attempt to remove a childView');
            result = base_view.closeChildView(childView1);
            ok(true, 'Ran without exception');
            strictEqual(base_view.children.length, 2, 'base_view has 2 children');

            ok(true, 'Attempt to remove a childView');
            result = base_view.closeChildView(childView2);
            ok(true, 'Ran without exception');
            strictEqual(base_view.children.length, 1, 'base_view has 1 child');

            ok(true, 'Attempt to remove a childView');
            result = base_view.closeChildView(childView3);
            ok(true, 'Ran without exception');
            strictEqual(base_view.children.length, 0, 'base_view has 0 children');

            start();
        });
    });
    asyncTest("base_view.closeChildViews()", function () {
        require(['base_view'], function(View) {
            var base_view = new View(),
                childView1 = new Backbone.View(),
                childView2 = new Backbone.View(),
                childView3 = new Backbone.View(),
                result;

            base_view.registerChildView(childView1, childView2, childView3);
            strictEqual(base_view.children.length, 3, 'Start with a base_view that has 3 children');

            ok(true, 'Attempt to close all child views');
            result = base_view.closeChildViews();
            ok(true, 'Ran without exception');
            strictEqual(base_view.children.length, 0, 'base_view has 0 children');

            start();
        });
    });
});
