$(document).ready(function () {
    'use strict';
    module('ParentView', {
        setup: function () {
            this.invalidTypes = function () {
                return {
                    'string': '',
                    'number': 1,
                    'function': function () {},
                    'array': [],
                    'object': {},
                    'boolean': true,
                    'undefined': undefined,
                    'null': null,
                    'Backbone.Collection': new Backbone.Collection(),
                    'Backbone.Model': new Backbone.Model(),
                    'Backbone.Router': new Backbone.Router()
                };
            };
        }
    });
    asyncTest('new base_view()', function () {
        require(['core/js/parentView'], function(ParentView) {
            ok(true, 'Attempt new view()');
            var view = new ParentView();
            ok(_.isUndefined(view.children), 'view.children is undefined');

            start();
        });
    });
    asyncTest('_initChildServices', function () {
        require(['core/js/parentView'], function(ParentView) {
            var view = new ParentView(),
                result;

            ok(true, 'Attempt view._initChildServices()');
            result = view._initChildServices();
            strictEqual(result, view, 'Returned this');
            ok(view.children instanceof Backbone.ChildViewContainer, 'Set view.children to instance of Backbone.ChildViewContainer');

            start();
        });
    });
    asyncTest('registerChildView() [no arguments]', function () {
        require(['core/js/parentView'], function(ParentView) {
            var view = new ParentView(),
                result;

            // registerChildView with no args
            ok(true, 'Attempt view.registerChildView() with no args');
            result = view.registerChildView();
            strictEqual(result, view, 'Returned this');
            ok(_.isUndefined(view.children), 'view.children remains undefined');

            start();
        });
    });
    asyncTest('registerChildView() [invalid type]', function () {
        var that = this;
        require(['core/js/parentView'], function(ParentView) {
            var view = new ParentView(),
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
    asyncTest('registerChildView() [multiple invalid types at once]', function () {
        var that = this;
        require(['core/js/parentView'], function(ParentView) {
            var view = new ParentView(),
                invalidTypes = that.invalidTypes(),
                result;

            ok(true, 'Attempt view.registerChildView() with multiple arguments');
            result = view.registerChildView.apply(view, _.values(invalidTypes));
            strictEqual(result, view, 'Returned this');
            ok(_.isUndefined(view.children), 'Successfully filtered all invalid arguments');

            start();
        });
    });
    asyncTest('registerChildView() [reference to itself]', function () {
        require(['core/js/parentView'], function(ParentView) {
            var view = new ParentView(),
                result;

            ok(true, 'Attempt view.registerChildView() with view as an argument');
            result = view.registerChildView(view);
            strictEqual(result, view, 'Returned this');
            ok(_.isUndefined(view.children), 'Successfully filtered reference to itself');

            start();
        });
    });
    asyncTest('registerChildView() [new Backbone.View and new base_view]', function () {
        require(['core/js/parentView'], function(ParentView) {
            var view = new ParentView(),
                newBackboneView = new Backbone.View(),
                newParentView = new ParentView(),
                result;

            // registerChild test
            ok(true, 'Attempt view.registerChildView() with a new Backbone.View');
            result = view.registerChildView(newBackboneView);
            strictEqual(result, view, 'Returned this');
            ok(!_.isUndefined(view.children), 'view.children is defined');
            strictEqual(view.children.length, 1, 'view has 1 child');
            strictEqual(view.children.findByCid(newBackboneView.cid), newBackboneView, 'newBackboneView is in view.children');

            ok(true, 'Attempt view.registerChildView() with a new base_view');
            result = view.registerChildView(newParentView);
            strictEqual(result, view, 'Returned this');
            strictEqual(view.children.length, 2, 'view has 2 children');
            strictEqual(view.children.findByCid(newParentView.cid), newParentView, 'newParentView is in view.children');
            start();
        });
    });
    asyncTest('registerChildView() [multiple Backbone.Views at once]', function () {
        require(['core/js/parentView'], function(ParentView) {
            var view = new ParentView(),
                result;

            ok(true, 'Attempt view.registerChildView() with multiple new Backbone.View');
            result = view.registerChildView(new Backbone.View(), new Backbone.View(), new Backbone.View());
            strictEqual(result, view, 'Returned this');
            ok(!_.isUndefined(view.children), 'view.children is defined');
            strictEqual(view.children.length, 3, 'view has 3 children');
            start();
        });
    });
    asyncTest('closeChildView() [invalid arguments]', function () {
        var that = this;
        require(['core/js/parentView'], function(ParentView) {
            var view = new ParentView(),
                invalidTypes = that.invalidTypes();

            view.registerChildView(new Backbone.View(), new Backbone.View(), new Backbone.View());

            _.each(invalidTypes, function (value, key) {
                ok(true, 'Attempt view.closeChildView(' + key + ')');
                var result = view.closeChildView(value);
                strictEqual(result, view, 'Returned this');
                strictEqual(view.children.length, 3, 'view still has 3 children');
            });

            start();
        });
    });
    asyncTest('closeChildView()', function () {
        require(['core/js/parentView'], function(ParentView) {
            var view = new ParentView(),
                childView1 = new Backbone.View(),
                childView2 = new ParentView(),
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
    asyncTest('closeChildViews()', function () {
        require(['core/js/parentView'], function(ParentView) {
            var view = new ParentView(),
                childView1 = new Backbone.View(),
                childView2 = new ParentView(),
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
    asyncTest('clean()', function () {
        require(['core/js/parentView'], function(ParentView) {
            var parentView = new ParentView(),
                childView = new ParentView();

            parentView.$el.html('test');
            parentView.registerChildView(childView);

            // All we care about here is that the child views were closed,
            // and that the html was emptied
            parentView.clean();

            strictEqual(parentView.children.length, 0, 'view has 0 children');
            strictEqual(parentView.$el.html(), '', 'clean() emptied its element html');

            start();
        });
    });
    asyncTest('close() [Many child views]', function () {
        require(['core/js/parentView'], function(ParentView) {
            var mainView = new ParentView(),
                childView1 = new ParentView(),
                childView2 = new ParentView();

            mainView.registerChildView(childView1);
            mainView.registerChildView(childView2);

            mainView.close();
            strictEqual(mainView.isClosed, true, 'mainView is closed');
            strictEqual(childView1.isClosed, true, 'childView1 is closed');
            strictEqual(childView2.isClosed, true, 'childView2 is closed');

            start();
        });
    });
    asyncTest('close() [Child has child]', function () {
        require(['core/js/parentView'], function(ParentView) {
            var mainView = new ParentView(),
                childView1 = new ParentView(),
                childView2 = new ParentView();

            mainView.registerChildView(childView1);
            childView1.registerChildView(childView2);

            mainView.close();
            strictEqual(mainView.isClosed, true, 'mainView is closed');
            strictEqual(childView1.isClosed, true, 'childView1 is closed');
            strictEqual(childView2.isClosed, true, 'childView2 is closed');

            start();
        });
    });
    asyncTest('close() [Circular reference]', function () {
        require(['core/js/parentView'], function(ParentView) {
            var mainView = new ParentView(),
                childView = new ParentView(),
                callCount = 0;

            // mainView.close should be called twice.
            // The first time by this test
            // The second time by the child view
            // If close is working correctly, then the second time should not
            // call the child's close method, preventing the infinite loop.
            mainView.close = _.wrap(mainView.close, function (originalClose) {
                callCount += 1;
                // If we reach 3 calls, an infinite loop is occurring
                if (callCount <= 3) {
                    // Apply the original close method
                    return originalClose.apply(mainView, arguments);
                } else {
                    // Break the loop by not Applying the original close method
                    return mainView;
                }
            });

            mainView.registerChildView(childView);
            childView.registerChildView(mainView);
            ok(true, '[mainView] has child [childView]');
            ok(true, '[childView] has child [mainView]');
            ok(true, 'Close method should prevent infinite loop');
            ok(true, 'Attempting mainView.close()');
            mainView.close();
            strictEqual(callCount, 2, 'Close method prevented infinite loop');
            strictEqual(mainView.isClosed, true, 'mainView is closed');
            strictEqual(childView.isClosed, true, 'childView is closed');

            start();
        });
    });
    //Note: In the case of a circular reference, calling closeChildViews will close
    //      the parent view, since a chile has a reference to the parent
});
