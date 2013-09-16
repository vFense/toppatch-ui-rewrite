$(document).ready(function () {
    'use strict';
    module('AlertView');

    asyncTest('Constructor', function () {
        require(
            ['core/js/modal/alertView'],
            function (AlertView) {
                var alertView = new AlertView();

                strictEqual(alertView.icon, null, 'icon is null');
                strictEqual(alertView.message, '', 'message is ""');
                strictEqual(alertView.information, '', 'information is ""');
                strictEqual(alertView.buttons.default, null, 'Default button is null');
                strictEqual(alertView.buttons.alternate, null, 'Alternate button is null');
                strictEqual(alertView.buttons.other, null, 'Other button is null');

                strictEqual(alertView.$el.attr('role'), 'alertdialog', 'element role:"alertdialog" set');
                start();
            }
        );
    });

    asyncTest('setButton', function () {
        require(
            ['core/js/modal/alertView', 'core/js/button'],
            function (AlertView, Button) {
                var alertView = new AlertView(),
                    defaultButton = new Button();

                alertView.setButton('wrong', {});
                strictEqual(alertView.buttons.default, null, 'default still null');
                strictEqual(alertView.buttons.alternate, null, 'altButton still null');
                strictEqual(alertView.buttons.other, null, 'othButton still null');

                alertView.setButton('default', defaultButton);
                deepEqual(alertView.buttons.default.attributes, {
                    title: 'Button',
                    style: 'btn-default',
                    disabled: false,
                    tagID: 0,
                    keyEquivalent: 0

                }, 'Set default button correctly');
                strictEqual(alertView.buttons.alternate, null, 'altButton still null');
                strictEqual(alertView.buttons.other, null, 'othButton still null');

                throws(function () {
                    alertView.setButton('default', 'OK');
                }, 'Throws TypeError when button argument is not instance of Button.Model or not null');

                start();
            }
        );
    });

    asyncTest('setButtons', function () {
        require(
            ['core/js/modal/alertView', 'core/js/button'],
            function (AlertView, Button) {
                var alertView;
                alertView = new AlertView();

                alertView.setButtons([
                    new Button({ title: 'OK' })
                ]);
                strictEqual(alertView.buttons.default.get('title'), 'OK', 'defButton title is "OK"');
                strictEqual(alertView.buttons.alternate, null, 'altButton is null');
                strictEqual(alertView.buttons.other, null, 'othButton is null');


                alertView.setButtons([
                    new Button({ title: 'OK' }),
                    new Button({ title: 'Cancel' })
                ]);
                strictEqual(alertView.buttons.default.get('title'), 'OK', 'defButton title is "OK"');
                strictEqual(alertView.buttons.alternate.get('title'), 'Cancel', 'altButton is title is "Cancel"');
                strictEqual(alertView.buttons.other, null, 'othButton is null');

                alertView.setButtons([
                    new Button({ title: 'OK' }),
                    new Button({ title: 'Cancel' }),
                    new Button({ title: 'Other' })
                ]);
                strictEqual(alertView.buttons.default.get('title'), 'OK', 'defButton title is "OK"');
                strictEqual(alertView.buttons.alternate.get('title'), 'Cancel', 'altButton is title is "Cancel"');
                strictEqual(alertView.buttons.other.get('title'), 'Other', 'othButton is title is "Other"');

                alertView.setButtons('Argument is not an array, should not cause change');
                strictEqual(alertView.buttons.default.get('title'), 'OK', 'defButton title is "OK"');
                strictEqual(alertView.buttons.alternate.get('title'), 'Cancel', 'altButton is title is "Cancel"');
                strictEqual(alertView.buttons.other.get('title'), 'Other', 'othButton is title is "Other"');

                alertView.setButtons([]); // Empty array will set all buttons to null
                strictEqual(alertView.buttons.default, null, 'defButton is null');
                strictEqual(alertView.buttons.alternate, null, 'altButton is null');
                strictEqual(alertView.buttons.other, null, 'othButton is null');

                start();
            }
        );
    });

    asyncTest('setMessage and setInformation', function () {
        require(
            ['core/js/modal/alertView'],
            function (AlertView) {
                var alertView,
                    message = 'Test message',
                    information = 'Test Information';
                alertView = new AlertView();

                alertView.setMessage(message);
                strictEqual(alertView.message, message, 'Message set correctly');

                alertView.setMessage([]); // Array is not a string, should not cause change
                strictEqual(alertView.message, message, 'Message set correctly');

                alertView.setInformation(information);
                strictEqual(alertView.information, information, 'Information set correctly');

                alertView.setInformation([]); // Array is not a string, should not cause change
                strictEqual(alertView.information, information, 'Information set correctly');

                start();
            }
        );
    });


    asyncTest('Rendering', function () {
        require(
            ['core/js/modal/alertView', 'core/js/button'],
            function (AlertView, Button) {
                var alertView = new AlertView(),
                    message = 'Alert message',
                    information = 'Alert information',
                    buttons = [
                        {title: 'Save'},
                        {title: 'Cancel'},
                        {title: 'Other'}
                    ];

                alertView
                    .setMessage(message)
                    .setInformation(information)
                    .setButtons([
                        new Button(buttons[0]),
                        new Button(buttons[1]),
                        new Button(buttons[2])
                    ]);

                var $el = alertView.render().$el,
                    $message = $el.find('.modal-alert-message'),
                    $information = $el.find('.modal-alert-information'),
                    $buttons = $el.find('.modal-alert-buttons > .btn');


                strictEqual($message.text(), message, 'Message was rendered correctly');
                strictEqual($information.text(), information, 'Information was rendered correctly');

                strictEqual($buttons[2].innerText, alertView.buttons.default.get('title'),
                    'Default Button has correct text');
                strictEqual($buttons[1].innerText, alertView.buttons.alternate.get('title'),
                    'Alternate Button has correct text');
                strictEqual($buttons[0].innerText, alertView.buttons.other.get('title'),
                    'Other Button has correct text');

                alertView.remove();
                start();
            }
        );
    });
});
