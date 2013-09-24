$(document).ready(function () {
    'use strict';
    module('alertFacade');

    asyncTest('_setKeyEquivalent', function () {
        require(
            ['core/js/modal/alertFacade', 'core/js/button'],
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
            ['core/js/modal/alertFacade', 'core/js/modal/alertView', 'core/js/button'],
            function (Alert, AlertView, Button) {
                var alert;

                throws(function () {
                    Alert.alertWithMessage();
                }, 'No arguments throws an error');

                // Message only
                ok(alert = Alert.alertWithMessage('Message'), 'Alert.alertWithMessage("Message")');
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
                ok(alert = Alert.alertWithMessage('Message2', 'Save', 'Cancel', 'Don\'t Save', 'Info'),
                    'Alert.alertWithMessage("Message", "Save", "Cancel", "Don\'t Save", "Info")'
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
            ['core/js/modal/alertFacade', 'core/js/modal/alertView', 'core/js/button'],
            function (Alert, AlertView) {
                var alert;

                throws(function () {
                    Alert.criticalAlertWithMessage();
                }, 'Throws error when message arg is not string');

                throws(function () {
                    Alert.criticalAlertWithMessage('Message');
                }, 'Throws error when dangerButtonTitle arg is not string');

                // Message, and Dangerous button only
                ok(alert = Alert.criticalAlertWithMessage('Message', 'Danger'), 'Alert.criticalAlertWithMessage("Message", "Danger")');
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
                ok(alert = Alert.criticalAlertWithMessage('Message', 'Danger', 'Safe', 'Other', 'Info'),
                    'Alert.criticalAlertWithMessage("Message", "Danger", "Safe", "Other", "Info")'
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
