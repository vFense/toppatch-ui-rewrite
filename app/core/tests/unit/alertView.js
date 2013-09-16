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
                strictEqual(alertView.defButton, null, 'Default button is null');
                strictEqual(alertView.altButton, null, 'Alternate button is null');
                strictEqual(alertView.othButton, null, 'Other button is null');

                strictEqual(alertView.$el.attr('role'), 'alertdialog', 'element role:"alertdialog" set');

                start();
            }
        );
    });

    asyncTest('Constructor [with options]', function () {
        require(
            ['core/js/modal/alertView', 'core/js/button'],
            function (AlertView, Button) {
                var alertView = new AlertView({
                    message: 'M',
                    information: 'I',
                    defButton: new Button({title: '0'}),
                    altButton: new Button({title: '1'}),
                    othButton: new Button({title: '2'})
                });

                strictEqual(alertView.message, 'M', 'message is correct');
                strictEqual(alertView.information, 'I', 'information is correct');
                strictEqual(alertView.defButton.get('title'), '0', 'Default button is correct');
                strictEqual(alertView.altButton.get('title'), '1', 'Alternate button is correct');
                strictEqual(alertView.othButton.get('title'), '2', 'Other button is correct');

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
                strictEqual(alertView.defButton, null, 'default still null');
                strictEqual(alertView.altButton, null, 'altButton still null');
                strictEqual(alertView.othButton, null, 'othButton still null');

                alertView.setButton('defButton', defaultButton);
                deepEqual(alertView.defButton.attributes, {
                    title: 'Button',
                    style: 'btn-default',
                    disabled: false,
                    tagID: 0,
                    keyEquivalent: 0

                }, 'Set default button correctly');
                strictEqual(alertView.altButton, null, 'altButton still null');
                strictEqual(alertView.othButton, null, 'othButton still null');

                throws(function () {
                    alertView.setButton('defButton', 'OK');
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
                strictEqual(alertView.defButton.get('title'), 'OK', 'defButton title is "OK"');
                strictEqual(alertView.altButton, null, 'altButton is null');
                strictEqual(alertView.othButton, null, 'othButton is null');


                alertView.setButtons([
                    new Button({ title: 'OK' }),
                    new Button({ title: 'Cancel' })
                ]);
                strictEqual(alertView.defButton.get('title'), 'OK', 'defButton title is "OK"');
                strictEqual(alertView.altButton.get('title'), 'Cancel', 'altButton is title is "Cancel"');
                strictEqual(alertView.othButton, null, 'othButton is null');

                alertView.setButtons([
                    new Button({ title: 'OK' }),
                    new Button({ title: 'Cancel' }),
                    new Button({ title: 'Other' })
                ]);
                strictEqual(alertView.defButton.get('title'), 'OK', 'defButton title is "OK"');
                strictEqual(alertView.altButton.get('title'), 'Cancel', 'altButton is title is "Cancel"');
                strictEqual(alertView.othButton.get('title'), 'Other', 'othButton is title is "Other"');

                alertView.setButtons('Argument is not an array, should not cause change');
                strictEqual(alertView.defButton.get('title'), 'OK', 'defButton title is "OK"');
                strictEqual(alertView.altButton.get('title'), 'Cancel', 'altButton is title is "Cancel"');
                strictEqual(alertView.othButton.get('title'), 'Other', 'othButton is title is "Other"');

                alertView.setButtons([]); // Empty array will set all buttons to null
                strictEqual(alertView.defButton, null, 'defButton is null');
                strictEqual(alertView.altButton, null, 'altButton is null');
                strictEqual(alertView.othButton, null, 'othButton is null');

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

                strictEqual($buttons[2].innerText, alertView.defButton.get('title'),
                    'Default Button has correct text');
                strictEqual($buttons[1].innerText, alertView.altButton.get('title'),
                    'Alternate Button has correct text');
                strictEqual($buttons[0].innerText, alertView.othButton.get('title'),
                    'Other Button has correct text');

                alertView.remove();
                start();
            }
        );
    });
});
