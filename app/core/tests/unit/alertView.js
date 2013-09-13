$(document).ready(function () {
    'use strict';
    module('AlertView');

    asyncTest('Constructor', function () {
        require(
            ['core/js/modal/alertView'],
            function (AlertView) {
                var alertView;
                alertView = new AlertView();

                ok(alertView.model instanceof Backbone.Model, 'Alert model is instance of Backbone.Model');

                var attributes = alertView.model.attributes;
                strictEqual(attributes.icon, null, 'icon is null');
                strictEqual(attributes.message, '', 'message is ""');
                strictEqual(attributes.information, '', 'information is ""');
                strictEqual(attributes.defButton, null, 'defButton is null');
                strictEqual(attributes.altButton, null, 'altButton is null');
                strictEqual(attributes.othButton, null, 'othButton is null');

                strictEqual(alertView.$el.attr('role'), 'alertdialog', 'element role:"alertdialog" set');
                start();
            }
        );
    });

    asyncTest('setButton', function () {
        require(
            ['core/js/modal/alertView', 'core/js/button'],
            function (AlertView, Button) {
                var alertView, defButton;
                alertView = new AlertView();
                defButton = new Button.View();

                var listener = _.extend({}, Backbone.Events),
                    changed = 0;
                listener.listenTo(alertView.model, 'change', function () { changed += 1; });
                alertView.setButton();
                strictEqual(changed, 0, 'No options, no change');

                changed = 0; // In case previous test caused a change
                alertView.setButton('defButton', defButton);
                strictEqual(changed, 1, 'Caused 1 model attribute change');
                deepEqual(alertView.model.get('defButton').model.attributes, {
                    title: 'Button',
                    style: 'btn-default',
                    disabled: false,
                    tagID: 0,
                    keyEquivalent: 0

                }, 'Set defButton correctly');
                strictEqual(alertView.model.get('altButton'), null, 'altButton still null');
                strictEqual(alertView.model.get('othButton'), null, 'othButton still null');


                listener.stopListening();
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
                    new Button.View({ model: 'OK' })
                ]);
                strictEqual(alertView.model.get('defButton').title(), 'OK', 'defButton title is "OK"');
                strictEqual(alertView.model.get('altButton'), null, 'altButton is null');
                strictEqual(alertView.model.get('othButton'), null, 'othButton is null');


                alertView.setButtons([
                    new Button.View({ model: 'OK' }),
                    new Button.View({ model: 'Cancel' })
                ]);
                strictEqual(alertView.model.get('defButton').title(), 'OK', 'defButton title is "OK"');
                strictEqual(alertView.model.get('altButton').title(), 'Cancel', 'altButton is title is "Cancel"');
                strictEqual(alertView.model.get('othButton'), null, 'othButton is null');

                alertView.setButtons([
                    new Button.View({ model: 'OK' }),
                    new Button.View({ model: 'Cancel' }),
                    new Button.View({ model: 'Other' })
                ]);
                strictEqual(alertView.model.get('defButton').title(), 'OK', 'defButton title is "OK"');
                strictEqual(alertView.model.get('altButton').title(), 'Cancel', 'altButton is title is "Cancel"');
                strictEqual(alertView.model.get('othButton').title(), 'Other', 'othButton is title is "Other"');

                alertView.setButtons('Argument is not an array, should not cause change');
                strictEqual(alertView.model.get('defButton').title(), 'OK', 'defButton title is "OK"');
                strictEqual(alertView.model.get('altButton').title(), 'Cancel', 'altButton is title is "Cancel"');
                strictEqual(alertView.model.get('othButton').title(), 'Other', 'othButton is title is "Other"');

                alertView.setButtons([]); // Empty array will set all buttons to null
                strictEqual(alertView.model.get('defButton'), null, 'defButton is null');
                strictEqual(alertView.model.get('altButton'), null, 'altButton is null');
                strictEqual(alertView.model.get('othButton'), null, 'othButton is null');

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
                strictEqual(alertView.model.get('message'), message, 'Message set correctly');

                alertView.setMessage([]); // Array is not a string, should not cause change
                strictEqual(alertView.model.get('message'), message, 'Message set correctly');

                alertView.setInformation(information);
                strictEqual(alertView.model.get('information'), information, 'Information set correctly');

                alertView.setInformation([]); // Array is not a string, should not cause change
                strictEqual(alertView.model.get('information'), information, 'Information set correctly');

                start();
            }
        );
    });

    asyncTest('Rendering', function () {
        require(
            ['core/js/modal/alertView', 'core/js/button'],
            function (AlertView, Button) {
                var alertView,
                    message = 'Alert message',
                    information = 'Alert information';
                alertView = new AlertView();

                alertView
                    .setMessage(message)
                    .setInformation(information)
                    .setButtons([
                        new Button.View({ model: {title: 'Save', keyEquivalent: '\r', 'btn-style': 'btn-primary' }}),
                        new Button.View({ model: {title: 'Cancel', 'keyEquivalent': '\x1B' }}),
                        new Button.View({ model: {title: 'Don\'t Save'}})
                    ]);

                var $el = alertView.render().$el,
                    $message = $el.find('.modal-alert-message'),
                    $information = $el.find('.modal-alert-information'),
                    $buttons = $el.find('.modal-alert-buttons .btn');

                strictEqual($message.text(), message, 'Message was rendered correctly');
                strictEqual($information.text(), information, 'Information was rendered correctly');

                var buttonTextArray = ['Don\'t Save', 'Cancel', 'Save'];
                $buttons.each(function (index, button) {
                    strictEqual($(button).text(), buttonTextArray[index], 'Button ' + (index + 1) + ' rendered correctly');
                });

                start();
            }
        );
    });
});
