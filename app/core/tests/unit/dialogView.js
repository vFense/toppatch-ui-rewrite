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
                strictEqual(dialog._isShown, false, '_isShown is correct');
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
});
