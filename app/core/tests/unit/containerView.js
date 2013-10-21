$(document).ready(function () {
    'use strict';
    module('ContainerView', {
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
    asyncTest('Constructor', function () {
        require(['core/js/containerView'], function(ContainerView) {
            ok(true, 'Attempt new view()');
            var view = new ContainerView();
            ok(!_.isUndefined(view.children), 'view.children is defined');

            start();
        });
    });
    asyncTest('registerChildView() [new Backbone.View and new View]', function () {
        require(['core/js/containerView'], function(ContainerView) {
            var view = new ContainerView(),
                newBackboneView = new Backbone.View(),
                newContainerView = new ContainerView(),
                result;

            // registerChild test
            ok(true, 'Attempt view.registerChildView() with a new Backbone.View');
            result = view.registerChildView(newBackboneView);
            strictEqual(result, view, 'Returned this');
            ok(!_.isUndefined(view.children), 'view.children is defined');
            strictEqual(view.children.length, 1, 'view has 1 child');
            strictEqual(view.children.findByCid(newBackboneView.cid), newBackboneView, 'newBackboneView is in view.children');

            ok(true, 'Attempt view.registerChildView() with a new View');
            result = view.registerChildView(newContainerView);
            strictEqual(result, view, 'Returned this');
            strictEqual(view.children.length, 2, 'view has 2 children');
            strictEqual(view.children.findByCid(newContainerView.cid), newContainerView, 'newContainerView is in view.children');
            start();
        });
    });
    asyncTest('registerChildView() [multiple Backbone.Views at once]', function () {
        require(['core/js/containerView'], function(ContainerView) {
            var view = new ContainerView(),
                result;

            ok(true, 'Attempt view.registerChildViews() with multiple new Backbone.Views');
            result = view.registerChildViews([new Backbone.View(), new Backbone.View(), new Backbone.View()]);
            strictEqual(result, view, 'Returned this');

            ok(true, 'Attempt view.registerChildViews() to register a view not passed as an array.');
            result = view.registerChildViews(new Backbone.View());
            strictEqual(result, view, 'Returned this');

            ok(!_.isUndefined(view.children), 'view.children is defined');
            strictEqual(view.children.length, 4, 'view has 4 children');
            start();
        });
    });
    asyncTest('closeChildView()', function () {
        require(['core/js/containerView'], function(ContainerView) {
            var view = new ContainerView(),
                childView1 = new Backbone.View(),
                childView2 = new ContainerView(),
                childView3 = new Backbone.View(),
                result;

            view.registerChildViews([childView1, childView2]);
            view.registerChildView(childView3, 'testView');
            strictEqual(view.children.length, 3, 'Start with a view that has 3 children');


            ok(true, 'Attempt view.closeChildView() with childView1 reference');
            result = view.closeChildView(childView1);
            strictEqual(result, view, 'Returned this');
            strictEqual(view.children.length, 2, 'view has 2 children');

            ok(true, 'Attempt view.closeChildView() with childView2 reference');
            result = view.closeChildView(childView2);
            strictEqual(result, view, 'Returned this');
            strictEqual(view.children.length, 1, 'view has 1 child');

            ok(true, 'Attempt view.closeChildView() with childView3 reference');
            result = view.closeChildView('testView');
            strictEqual(result, view, 'Returned this');
            strictEqual(view.children.length, 0, 'view has 0 child');
            start();
        });
    });
    asyncTest('closeChildViews()', function () {
        require(['core/js/containerView'], function(ContainerView) {
            var view = new ContainerView(),
                childView1 = new Backbone.View(),
                childView2 = new ContainerView(),
                result;

            view.registerChildViews([childView1, childView2]);
            strictEqual(view.children.length, 2, 'Start with a view that has 2 children');

            ok(true, 'Attempt view.closeChildViews()');
            result = view.closeChildViews();
            strictEqual(result, view, 'Returned this');
            strictEqual(view.children.length, 0, 'view has 0 children');

            start();
        });
    });
    asyncTest('clean()', function () {
        require(['core/js/containerView'], function(ContainerView) {
            var containerView = new ContainerView(),
                childView = new ContainerView();

            containerView.$el.html('test');
            containerView.registerChildView(childView);

            // All we care about here is that the child views were closed,
            // and that the html was emptied
            containerView.clean();

            strictEqual(containerView.children.length, 0, 'view has 0 children');
            strictEqual(containerView.$el.html(), '', 'clean() emptied its element html');

            start();
        });
    });
    asyncTest('close() [Many child views]', function () {
        require(['core/js/containerView'], function(ContainerView) {
            var mainView = new ContainerView(),
                childView1 = new ContainerView(),
                childView2 = new ContainerView();

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
        require(['core/js/containerView'], function(ContainerView) {
            var mainView = new ContainerView(),
                childView1 = new ContainerView(),
                childView2 = new ContainerView();

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
        require(['core/js/containerView'], function(ContainerView) {
            var mainView = new ContainerView(),
                childView = new ContainerView(),
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
    asyncTest('getChildByName()', function () {
        require(['core/js/containerView'], function (ContainerView) {
            var view = new ContainerView(),
                childView = new Backbone.View(),
                result;
            view.registerChildView(childView, 'testView');
            result = view.getChildByName('testView');
            strictEqual(result, childView, 'getChildByName() returns the right view');

            start();
        });
    });
    asyncTest('getChildByCID()', function () {
        require(['core/js/containerView'], function (ContainerView) {
            var view = new ContainerView(),
                childView = new Backbone.View(),
                cid = childView.cid,
                result;
            view.registerChildView(childView);
            result = view.getChildByCID(cid);
            strictEqual(result, childView, 'getChildByCID() returns the right view');

            start();
        });
    });
});
