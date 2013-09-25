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
                var alertView = new AlertView({
                        animate: false
                    }),
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
                alertView = new AlertView({
                    animate: false
                });

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
                var alertView = new AlertView({
                        animate: false
                    }),
                    message = 'Test message',
                    information = 'Test Information';

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
                var alertView = new AlertView({
                        animate: false
                    }),
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

    asyncTest('Open', function () {
        require(
            ['core/js/modal/alertView', 'core/js/button'],
            function (AlertView, Button) {
                var alertView = new AlertView({
                    animate: false
                });

                throws(function () { alertView.open(); }, Error, 'Throws error with empty message');

                ok(alertView.setMessage('Alert'), 'Set message to "Alert"');

                throws(function () { alertView.open(); }, TypeError,
                    'Throws TypeError when defButton is not instance of Button'
                );

                ok(alertView.setButton('defButton', new Button()), 'Set defButton to new Button()');

                alertView.open();

                strictEqual(alertView.isShown(), true, 'Opened modal');

                alertView.hide();
                start();
            }
        );
    });

    asyncTest('clickEventHandler', function () {
        require(
            ['core/js/modal/alertView', 'core/js/button', 'jquery.simulate'],
            function (AlertView, Button) {
                var alertView, $button;

                alertView = new AlertView({
                    animate: false,
                    message: 'Alert',
                    defButton: new Button({title: 'OK', tagID: 1000}),
                    altButton: new Button({title: 'Cancel', tagID: 1001}),
                    othButton: new Button({title: 'Don\'t Save', tagID: 1002})
                });

                alertView.open();
                $button = alertView.defButton.$el;
                ok($button.simulate('click'), 'Simulate click event');
                strictEqual(alertView.result, 1000, 'Result code is correct');
                strictEqual(alertView.isShown(), false, 'Modal closed after event');

                alertView.open();
                $button = alertView.altButton.$el;
                ok($button.simulate('click'), 'Simulate click event');
                strictEqual(alertView.result, 1001, 'Result code is correct');
                strictEqual(alertView.isShown(), false, 'Modal closed after event');

                alertView.open();
                $button = alertView.othButton.$el;
                ok($button.simulate('click'), 'Simulate click event');
                strictEqual(alertView.result, 1002, 'Result code is correct');
                strictEqual(alertView.isShown(), false, 'Modal closed after event');

                start();
            }
        );
    });

    asyncTest('keyEventHandler', function () {
        require(
            ['core/js/modal/alertView', 'core/js/button', 'jquery.simulate'],
            function (AlertView, Button) {
                var alertView = new AlertView({
                    animate: false,
                    message: 'Alert',
                    defButton: new Button({title: 'Save', keyEquivalent: $.simulate.keyCode.ENTER, tagID: 1000})
                });

                alertView.open();
                var $el = alertView.$el;
                ok($el.simulate('keyup', { keyCode: $.simulate.keyCode.ENTER }), 'Simulate keyup event');
                strictEqual(alertView.result, 1000, 'Result code is correct');
                strictEqual(alertView.isShown(), false, 'Modal closed after event');
                start();
            }
        );
    });

    asyncTest('close', function () {
        require(
            ['core/js/modal/alertView', 'core/js/button'],
            function (AlertView, Button) {
                var alertView = new AlertView({
                    animate: false,
                    message: 'Alert',
                    defButton: new Button()
                });

                var defButton = alertView.defButton,
                    called = 0;
                // Override the remove function to increment called.
                // Then call the original remove function.
                defButton.remove = function () {
                    called += 1;
                    return Button.prototype.remove.apply(this, arguments);
                };
                alertView.open().hide(); // Hide calls close

                strictEqual(called, 1, 'Called defButton.remove');

                ok(alertView.close(), 'Run close() again');

                strictEqual(called, 1, 'Did not call defButton.remove again');

                start();
            }
        );
    });

    asyncTest('_setKeyEquivalent', function () {
        require(
            ['core/js/modal/alertView', 'core/js/button'],
            function (Alert, Button) {
                var button = new Button();
                button.set('title', 'Cancel');
                Alert._setKeyEquivalent(button);

                strictEqual(button.get('keyEquivalent'), 27, 'When title is "Cancel", sets keyEquivalent to [ESCAPE]');

                button.set('keyEquivalent', 13);

                Alert._setKeyEquivalent(button);
                strictEqual(button.get('keyEquivalent'), 13, 'Does not change keyEquivalent when key is already [ENTER]');

                start();
            }
        );
    });

    asyncTest('alertWithMessage', function () {
        require(
            ['core/js/modal/alertView', 'core/js/button'],
            function (AlertView, Button) {
                var alert;

                throws(function () {
                    AlertView.alertWithMessage();
                }, 'No arguments throws an error');

                // Message only
                ok(alert = AlertView.alertWithMessage('Message'), 'AlertView.alertWithMessage("Message")');
                ok(alert instanceof AlertView, 'returned instance of AlertView');
                strictEqual(alert.message, 'Message', 'Message is correct');
                ok(alert.defButton instanceof Button, 'defButton is instanceof Button');
                strictEqual(alert.defButton.get('title'), 'OK', 'defButton has correct title');
                strictEqual(alert.defButton.get('style'), 'btn-primary', 'defButton has correct style');
                strictEqual(alert.defButton.get('tagID'), 1000, 'defButton has correct tagID');
                strictEqual(alert.defButton.get('keyEquivalent'), 13, 'defButton has correct keyEquivalent');

                strictEqual(alert.altButton, null, 'altButton is null');
                strictEqual(alert.othButton, null, 'othButton is null');
                strictEqual(alert.information, '', 'information is empty string');

                // All arguments
                ok(alert = AlertView.alertWithMessage('Message2', 'Save', 'Cancel', 'Don\'t Save', 'Info'),
                    'AlertView.alertWithMessage("Message", "Save", "Cancel", "Don\'t Save", "Info")'
                );
                ok(alert instanceof AlertView, 'returned instance of AlertView');
                strictEqual(alert.message, 'Message2', 'Message is correct');
                ok(alert.defButton instanceof Button, 'defButton is instanceof Button');
                strictEqual(alert.defButton.get('title'), 'Save', 'defButton has correct title');
                strictEqual(alert.defButton.get('style'), 'btn-primary', 'defButton has correct style');
                strictEqual(alert.defButton.get('tagID'), 1000, 'defButton has correct tagID');
                strictEqual(alert.defButton.get('keyEquivalent'), 13, 'defButton has correct keyEquivalent');

                strictEqual(alert.altButton.get('title'), 'Cancel', 'altButton has correct title');
                strictEqual(alert.altButton.get('style'), 'btn-default', 'altButton has correct style');
                strictEqual(alert.altButton.get('tagID'), 1001, 'altButton has correct tagID');
                strictEqual(alert.altButton.get('keyEquivalent'), 27, 'altButton has correct keyEquivalent');

                strictEqual(alert.othButton.get('title'), 'Don\'t Save', 'othButton has correct title');
                strictEqual(alert.othButton.get('style'), 'btn-default', 'othButton has correct style');
                strictEqual(alert.othButton.get('tagID'), 1002, 'othButton has correct tagID');
                strictEqual(alert.othButton.get('keyEquivalent'), 0, 'othButton has correct keyEquivalent');

                strictEqual(alert.information, 'Info', 'Information is correct');

                start();
            }
        );
    });

    asyncTest('criticalAlertWithMessage', function () {
        require(
            ['core/js/modal/alertView'],
            function (AlertView) {
                var alert;

                throws(function () {
                    AlertView.criticalAlertWithMessage();
                }, 'Throws error when message arg is not string');

                throws(function () {
                    AlertView.criticalAlertWithMessage('Message');
                }, 'Throws error when dangerButtonTitle arg is not string');

                // Message, and Dangerous button only
                ok(alert = AlertView.criticalAlertWithMessage('Message', 'Danger'), 'AlertView.criticalAlertWithMessage("Message", "Danger")');
                ok(alert instanceof AlertView, 'returned instance of AlertView');
                strictEqual(alert.defButton.get('title'), 'Cancel', 'defButton (safe button) has correct title');
                strictEqual(alert.defButton.get('style'), 'btn-default', 'defButton (safe button) has correct style');
                strictEqual(alert.defButton.get('tagID'), 1000, 'defButton (safe button) has correct tagID');
                strictEqual(alert.defButton.get('keyEquivalent'), 27, 'defButton (safe button) has correct keyEquivalent');

                strictEqual(alert.altButton.get('title'), 'Danger', 'altButton (danger button) has correct title');
                strictEqual(alert.altButton.get('style'), 'btn-primary', 'altButton (danger button) has correct style');
                strictEqual(alert.altButton.get('tagID'), 1001, 'altButton (danger button) has correct tagID');
                strictEqual(alert.altButton.get('keyEquivalent'), 13, 'altButton (danger button) has correct keyEquivalent');

                strictEqual(alert.othButton, null, 'othButton is null');
                strictEqual(alert.information, '', 'information is empty string');

                // All Arguments
                ok(alert = AlertView.criticalAlertWithMessage('Message', 'Danger', 'Safe', 'Other', 'Info'),
                    'AlertView.criticalAlertWithMessage("Message", "Danger", "Safe", "Other", "Info")'
                );
                ok(alert instanceof AlertView, 'returned instance of AlertView');
                strictEqual(alert.defButton.get('title'), 'Safe', 'defButton (safe button) has correct title');
                strictEqual(alert.defButton.get('style'), 'btn-default', 'defButton (safe button) has correct style');
                strictEqual(alert.defButton.get('tagID'), 1000, 'defButton (safe button) has correct tagID');
                strictEqual(alert.defButton.get('keyEquivalent'), 0, 'defButton (safe button) has correct keyEquivalent');

                strictEqual(alert.altButton.get('title'), 'Other', 'altButton (danger button) has correct title');
                strictEqual(alert.altButton.get('style'), 'btn-default', 'altButton (danger button) has correct style');
                strictEqual(alert.altButton.get('tagID'), 1001, 'altButton (danger button) has correct tagID');
                strictEqual(alert.altButton.get('keyEquivalent'), 0, 'altButton (danger button) has correct keyEquivalent');

                strictEqual(alert.othButton.get('title'), 'Danger', 'othButton has correct title');
                strictEqual(alert.othButton.get('style'), 'btn-primary', 'othButton has correct style');
                strictEqual(alert.othButton.get('tagID'), 1002, 'othButton has correct tagID');
                strictEqual(alert.othButton.get('keyEquivalent'), 13, 'othButton has correct keyEquivalent');

                strictEqual(alert.information, 'Info', 'Information is correct');

                start();
            }
        );
    });
});
