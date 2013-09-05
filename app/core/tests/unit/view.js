$(document).ready(function () {
    'use strict';
    module('View', {
        setup: $.noop,
        teardown: $.noop
    });

    asyncTest('clean()', function () {
        require(['core/js/view'], function(BaseView) {
            var baseView = new BaseView();
            baseView.$el.html('Hello World!');
            strictEqual(baseView.$el.html(), 'Hello World!', 'view html = "Hello World!"');
            baseView.clean();
            strictEqual(baseView.$el.html(), '', 'clean() emptied its element html');
            start();
        });
    });

    asyncTest('close()', function () {
        require(['core/js/view'], function(BaseView) {
            var beforeCloseCalled = false,
                $body = $('body'),
                View = BaseView.extend({
                    beforeClose: function () {
                        beforeCloseCalled = true;
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
            strictEqual(view.isClosed, true, 'view.isClosed was set to true upon view.close completion');
            strictEqual(result, view, 'view.close returned view');

            start();
        });
    });
});