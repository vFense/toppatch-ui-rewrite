$(document).ready(function () {
    'use strict';
    module('views/modal/Modal');

    asyncTest('Constructor', function () {
        require(
            ['core/js/views/modal/modal'],
            function (ModalView) {
                var dialog;

                // default constructor
                dialog = new ModalView();
                ok(dialog instanceof ModalView, 'Created default instance of ModalView');
                strictEqual(dialog.className, 'modal', 'className is correct');
                strictEqual(dialog.animate, true, 'animate is correct');
                ok(dialog.$el.hasClass('fade'), 'Has class fade when animate is true');
                strictEqual(dialog.keyboard, true, 'keyboard is correct');
                strictEqual(dialog.backdrop, true, 'backdrop is correct');

                // constructor with options
                dialog = new ModalView({
                    animate: false,
                    keyboard: false,
                    backdrop: false
                });
                ok(dialog instanceof ModalView, 'Created instance of ModalView with options');
                strictEqual(dialog.animate, false, 'animate is correct');
                strictEqual(dialog.keyboard, false, 'keyboard is correct');
                strictEqual(dialog.backdrop, false, 'backdrop is correct');

                start();
            }
        );
    });

    asyncTest('Events', function () {
        require(
            ['core/js/views/modal/modal'],
            function (ModalView) {
                var dialog;

                dialog = new ModalView({
                    animate: false
                });
                var wrapped = {
                    close: { fn: dialog.close, calls: 0 }
                };
                dialog.close = function () {
                    wrapped.close.calls += 1;
                    return this;
                };
                ok(_.has(_.result(dialog, 'events'), 'hidden.bs.modal'), 'Includes "hidden.bs.modal" event');

                dialog.$el.trigger('hidden.bs.modal');
                strictEqual(wrapped.close.calls, 1, 'Triggering "hidden.bs.model" called close');

                start();
            }
        );
    });

    asyncTest('isShown', function () {
        require(
            ['core/js/views/modal/modal'],
            function (ModalView) {
                var dialog;

                dialog = new ModalView({
                    animate: false
                });

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
            ['core/js/views/modal/modal'],
            function (ModalView) {
                var dialog;

                dialog = new ModalView({
                    animate: false
                });

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
            ['core/js/views/modal/modal'],
            function (ModalView) {
                var dialog;
                dialog = new ModalView({
                    animate: false
                });

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
            ['core/js/views/modal/modal'],
            function (ModalView) {
                var dialog;

                dialog = new ModalView({
                    animate: false
                });

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

    asyncTest('Close', function () {
        require(
            ['core/js/views/modal/modal'],
            function (ModalView) {
                var dialog;

                dialog = new ModalView({
                    animate: false
                });
                var wrapped = {
                    hide: { fn: dialog.hide, calls: 0 }
                };
                dialog.hide = function () {
                    wrapped.hide.calls += 1;
                    wrapped.hide.fn.apply(dialog, arguments);
                    return this;
                };

                dialog.$el.modal('show');

                var $backdrop = $('.modal-backdrop');
                strictEqual($backdrop.parent().length, 1, 'Confirm modal-backdrop is visible');

                ok(dialog.close(), 'Called close without exception');
                strictEqual(wrapped.hide.calls, 1, 'Close called hide');

                $backdrop = $($backdrop.selector);
                strictEqual($backdrop.parent().length, 0, 'Confirm modal-backdrop is removed');

                ok(dialog.close(), 'Called close, again, without exception');
                strictEqual(wrapped.hide.calls, 1, 'Close did NOT call hide. Modal already closed');

                start();
            }
        );
    });
});
