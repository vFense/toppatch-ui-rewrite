$(document).ready(function () {
    'use strict';
    module('DialogView');

    asyncTest('Constructor', function () {
        require(
            ['core/js/dialogView'],
            function (DialogView) {
                var dialog;

                // default constructor
                dialog = new DialogView();
                ok(dialog instanceof DialogView, 'Created default instance of DialogView');
                strictEqual(dialog.className, 'modal', 'className is correct');
                strictEqual(dialog.animate, false, 'animate is correct');
                strictEqual(dialog.keyboard, true, 'keyboard is correct');
                strictEqual(dialog.backdrop, true, 'backdrop is correct');

                // constructor with options
                dialog = new DialogView({
                    animate: true,
                    keyboard: false,
                    backdrop: false
                });
                ok(dialog instanceof DialogView, 'Created instance of DialogView with options');
                strictEqual(dialog.animate, true, 'animate is correct');
                ok(dialog.$el.hasClass('fade'), 'Has class fade when animate is true');
                strictEqual(dialog.keyboard, false, 'keyboard is correct');
                strictEqual(dialog.backdrop, false, 'backdrop is correct');

                start();
            }
        );
    });

    asyncTest('Events', function () {
        require(
            ['core/js/dialogView'],
            function (DialogView) {
                var dialog;

                dialog = new DialogView();
                var wrapped = {
                    close: { fn: dialog.close, calls: 0 }
                };
                dialog.close = function () {
                    wrapped.close.calls += 1;
                    return this;
                };
                ok(_.has(dialog.events(), 'hidden.bs.modal'), 'Includes "hidden.bs.modal" event');

                dialog.$el.trigger('hidden.bs.modal');
                strictEqual(wrapped.close.calls, 1, 'Triggering "hidden.bs.model" called close');

                start();
            }
        );
    });

    asyncTest('isShown', function () {
        require(
            ['core/js/dialogView'],
            function (DialogView) {
                var dialog;

                dialog = new DialogView();

                strictEqual(dialog.isShown(), false, 'Returns false before modal init');

                dialog.$el.modal('show');
                strictEqual(dialog.isShown(), true, 'Returns true after modal("show")');

                dialog.$el.modal('hide');
                strictEqual(dialog.isShown(), false, 'Returns false after modal("hide")');

                dialog.remove();
                start();
            }
        );
    });

    asyncTest('Open', function () {
        require(
            ['core/js/dialogView'],
            function (DialogView) {
                var dialog;

                dialog = new DialogView();
                dialog.animate = true;

                var wrapped = {
                    render: { fn: dialog.render, calls: 0 },
                    delegateEvents: { fn: dialog.delegateEvents, calls: 0 }
                };
                dialog.render = function () {
                    wrapped.render.calls += 1;
                    return wrapped.render.fn.apply(dialog, arguments);
                };
                dialog.delegateEvents = function () {
                    wrapped.delegateEvents.calls += 1;
                    return wrapped.delegateEvents.fn.apply(dialog, arguments);
                };
                ok(dialog.open(), 'Called open without exception');
                strictEqual(wrapped.render.calls, 1, 'Called render');
                strictEqual(wrapped.delegateEvents.calls, 1, 'Called delegateEvents');
                strictEqual(dialog.$el.parent().length, 1, 'Dialog was inserted into the DOM');

                ok(dialog.open(), 'Called open, again, without exception');
                strictEqual(wrapped.render.calls, 1, 'Did not call render');
                strictEqual(wrapped.delegateEvents.calls, 1, 'Did not call delegateEvents');

                // Do not use dialog.hide in case hide method is broken
                dialog.$el.modal('hide');

                ok(dialog.open(), 'Called open, after modal hide, without exception');
                strictEqual(wrapped.render.calls, 2, 'Called render');
                strictEqual(wrapped.delegateEvents.calls, 2, 'Called delegateEvents');

                dialog.$el.modal('hide');
                ok(dialog.render(), 'Render before open');
                ok(dialog.open(), 'Called open without exception');
                strictEqual(wrapped.render.calls, 3, 'Did not call render');
                strictEqual(wrapped.delegateEvents.calls, 3, 'Called delegateEvents');

                dialog.$el.modal('hide');
                start();
            }
        );
    });

    asyncTest('Hide', function () {
        require(
            ['core/js/dialogView'],
            function (DialogView) {
                var dialog;
                dialog = new DialogView();

                dialog.$el.modal('show');

                ok(dialog.hide(), 'Call hide without exception');
                strictEqual(dialog.isShown(), false, 'Hides modal successfully');

                dialog.remove();
                start();
            }
        );
    });

    asyncTest('toggleAnimate', function () {
        require(
            ['core/js/dialogView'],
            function (DialogView) {
                var dialog;

                dialog = new DialogView();

                dialog.toggleAnimate(true);
                strictEqual(dialog.animate, true, 'Forced animate to true');
                strictEqual(dialog.$el.hasClass('fade'), true, 'Element has "fade" class');

                dialog.toggleAnimate(false);
                strictEqual(dialog.animate, false, 'Forced animate to false');
                strictEqual(dialog.$el.hasClass('fade'), false, 'Element does not have "fade" class');

                dialog.toggleAnimate();
                strictEqual(dialog.animate, true, 'Toggled animate to true');
                strictEqual(dialog.$el.hasClass('fade'), true, 'Element has "fade" class');

                dialog.toggleAnimate();
                strictEqual(dialog.animate, false, 'Toggled animate to false');
                strictEqual(dialog.$el.hasClass('fade'), false, 'Element does not have "fade" class');

                start();
            }
        );
    });
});
