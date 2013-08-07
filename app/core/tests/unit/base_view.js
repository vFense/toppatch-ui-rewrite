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
            var base_view = new View();

            ok(true, 'new base_view ran without error');
            ok(base_view.__super__ === Backbone.View.prototype, 'base_view.__super__ points to Backbone.View.prototype');
            ok(_.isUndefined(base_view.children), 'base_view.children is undefined');

            start();
        });
    });
    asyncTest("base_view._initChildServices", function () {
        require(['base_view'], function(View) {
            var base_view = new View(),
                result;

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
            var base_view = new View();

            _.each(that.invalidTypes(), function (value, key) {
                var result = base_view.registerChildView(value);
                ok(true, 'registerChildView(' + key + ') ran without exception');
                ok(result === base_view, 'Returned this');
                ok(_.isUndefined(base_view.children), 'Successfully filtered ' + key + 'type');
            });

            start();
        });
    });
    asyncTest("base_view.registerChildView() [multiple invalid types at once]", function () {
        var that = this;
        require(['base_view'], function(View) {
            var base_view = new View(),
                result = base_view.registerChildView.apply(base_view, _.values(that.invalidTypes()));

            ok(true, 'Attempt to add multiple invalid types at once, ran without exception');
            ok(result === base_view, 'Returned this');
            ok(_.isUndefined(base_view.children), 'Successfully filtered all invalid arguments');

            start();
        });
    });
    asyncTest("base_view.registerChildView(Backbone.View)", function () {
        require(['base_view'], function(View) {
            var base_view = new View(),
                childView1 = new Backbone.View();

            // registerChild test
            ok(base_view.registerChildView(childView1) === base_view,
                'Attempt to add 1 instance of Backbone.View, ran without exception, returned this'
            );
            ok(!_.isUndefined(base_view.children), 'base_view.children is defined');

            ok(base_view.children.length === 1, 'base_view has 1 child');
            ok(base_view.children.findByCid(childView1.cid) === childView1, '');

            start();
        });
    });
    asyncTest("base_view tests", function () {
        require(['base_view'], function(View) {
            var $body = $('body'),
                base_view = new View();

            base_view.$el.appendTo($body);
            ok(base_view.$el.parent()[0] === $body[0], 'base_view appended to body');

            // Close parent with no children test
            base_view.close();
            ok(true, 'base_view.close executed without error');
            ok(base_view.$el.parent().length === 0, 'base_view.close removed base_view from the body');

            start();
        });
    });

});
