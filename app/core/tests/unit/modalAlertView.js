$(document).ready(function () {
    'use strict';
    module('AlertView');

    asyncTest('Constructor', function () {
        require(
            ['core/js/modal/alertView'],
            function (AlertView) {
                var alert;
                alert = new AlertView();

                ok(alert.model instanceof Backbone.Model, 'Alert model is instance of Backbone.Model');

                var attributes = alert.model.attributes;
                strictEqual(attributes.icon, null, 'icon is null');
                strictEqual(attributes.message, '', 'message is ""');
                strictEqual(attributes.information, '', 'information is ""');
                strictEqual(attributes.defButton, null, 'defButton is null');
                strictEqual(attributes.altButton, null, 'altButton is null');
                strictEqual(attributes.othButton, null, 'othButton is null');

                strictEqual(alert.$el.attr('role'), 'alertdialog', 'element role:"alertdialog" set');
                start();
            }
        );
    });

    asyncTest('createButton', function () {
        require(
            ['core/js/modal/alertView'],
            function (AlertView) {
                var alert, result, expecting;
                alert = new AlertView();

                result = alert.createButton();
                expecting = { 'btn-style': 'btn-default', keyEquivalent: null, tag: null, title: 'No Title' };
                deepEqual(result, expecting);

                result = alert.createButton({ title: 'OK' });
                expecting = { 'btn-style': 'btn-default', keyEquivalent: null, tag: null, title: 'OK' };
                deepEqual(result, expecting);

                result = alert.createButton({
                    'btn-style': 'btn-primary',
                    keyEquivalent: '\r',
                    tag: 1000,
                    title: 'Done'
                });
                expecting = {
                    'btn-style': 'btn-primary',
                    keyEquivalent: 13, // keyEquivalent converted to charCodeAt(0)
                    tag: 1000,
                    title: 'Done'
                };
                deepEqual(result, expecting);

                start();
            }
        );
    });

    asyncTest('setButton', function () {
        require(
            ['core/js/modal/alertView'],
            function (AlertView) {
                var alert;
                alert = new AlertView();

                var listener = _.extend({}, window.libs.Backbone.Events),
                    changed = 0;
                listener.listenTo(alert.model, 'change', function () { changed += 1; });
                alert.setButton();
                strictEqual(changed, 0, 'No options, no change');

                changed = 0; // In case previous test caused a change
                alert.setButton('defButton', {title: 'OK'});
                strictEqual(changed, 1, 'Caused 1 model attribute change');
                deepEqual(alert.model.get('defButton'), {
                    'btn-style': 'btn-default',
                    keyEquivalent: null,
                    tag: null,
                    title: 'OK'
                }, 'Set defButton correctly');
                strictEqual(alert.model.get('altButton'), null, 'altButton still null');
                strictEqual(alert.model.get('othButton'), null, 'othButton still null');


                listener.stopListening();
                start();
            }
        );
    });

    asyncTest('setButtons', function () {
        require(
            ['core/js/modal/alertView'],
            function (AlertView) {
                var alert;
                alert = new AlertView();

                alert.setButtons([
                    { title: 'OK' }
                ]);
                strictEqual(alert.model.get('defButton').title, 'OK', 'defButton title is "OK"');
                strictEqual(alert.model.get('altButton'), null, 'altButton is null');
                strictEqual(alert.model.get('othButton'), null, 'othButton is null');


                alert.setButtons([
                    { title: 'OK' },
                    { title: 'Cancel' }
                ]);
                strictEqual(alert.model.get('defButton').title, 'OK', 'defButton title is "OK"');
                strictEqual(alert.model.get('altButton').title, 'Cancel', 'altButton is title is "Cancel"');
                strictEqual(alert.model.get('othButton'), null, 'othButton is null');

                alert.setButtons([
                    { title: 'OK' },
                    { title: 'Cancel' },
                    { title: 'Other' }
                ]);
                strictEqual(alert.model.get('defButton').title, 'OK', 'defButton title is "OK"');
                strictEqual(alert.model.get('altButton').title, 'Cancel', 'altButton is title is "Cancel"');
                strictEqual(alert.model.get('othButton').title, 'Other', 'othButton is title is "Other"');

                alert.setButtons('Argument is not an array, should not cause change');
                strictEqual(alert.model.get('defButton').title, 'OK', 'defButton title is "OK"');
                strictEqual(alert.model.get('altButton').title, 'Cancel', 'altButton is title is "Cancel"');
                strictEqual(alert.model.get('othButton').title, 'Other', 'othButton is title is "Other"');

                alert.setButtons([]); // Empty array will set all buttons to null
                strictEqual(alert.model.get('defButton'), null, 'defButton is null');
                strictEqual(alert.model.get('altButton'), null, 'altButton is null');
                strictEqual(alert.model.get('othButton'), null, 'othButton is null');

                start();
            }
        );
    });

    asyncTest('setMessage and setInformation', function () {
        require(
            ['core/js/modal/alertView'],
            function (AlertView) {
                var alert,
                    message = 'Test message',
                    information = 'Test Information';
                alert = new AlertView();

                alert.setMessage(message);
                strictEqual(alert.model.get('message'), message, 'Message set correctly');

                alert.setMessage([]); // Array is not a string, should not cause change
                strictEqual(alert.model.get('message'), message, 'Message set correctly');

                alert.setInformation(information);
                strictEqual(alert.model.get('information'), information, 'Information set correctly');

                alert.setInformation([]); // Array is not a string, should not cause change
                strictEqual(alert.model.get('information'), information, 'Information set correctly');

                start();
            }
        );
    });

    asyncTest('Rendering', function () {
        require(
            ['core/js/modal/alertView'],
            function (AlertView) {
                var alert,
                    message = 'Alert message',
                    information = 'Alert information';
                alert = new AlertView();

                alert
                    .setMessage(message)
                    .setInformation(information)
                    .setButtons([
                        {title: 'Save', keyEquivalent: '\r', 'btn-style': 'btn-primary' },
                        {title: 'Cancel', 'keyEquivalent': '\x1B' },
                        {title: 'Don\'t Save'}
                    ]);

                var $el = alert.$el,
                    $message = $el.find('.modal-alert-title'),
                    $information = $el.find('.modal-alert-message'),
                    $buttons = $el.find('.modal-alert-buttons');


                alert.open();
                console.log(alert.$el);

                ok(true);
                start();
            }
        );
    });
});
