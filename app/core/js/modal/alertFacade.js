define(
    ['core/js/modal/alertView', 'core/js/button'],
    function (AlertView, Button) {
        'use strict';

        /**
         * The Alert Object is a facade that provides a
         * simplified interface for initializing new AlertViews
         *
         * For more information about the facade pattern
         * see [Facade pattern - Wikipedia](http://bit.ly/gYAK9)
         * and [JavaScript Design Patterns](http://bit.ly/191rQO9)
         * @class Alert
         * @static
         */
        var Alert = {},
            ENTER = 13,
            ESCAPE = 27;

        _.extend(Alert, {
            /**
             * The return value if the default button is pressed
             * @property defReturn
             * @type Number
             * @default 1000
             * @final
             */
            defReturn: 1000,
            /**
             * The return value if the alternate button is pressed
             * @property altReturn
             * @type Number
             * @default 1001
             * @final
             */
            altReturn: 1001,
            /**
             * The return value if the other button is pressed
             * @property othReturn
             * @type Number
             * @default 1002
             * @final
             */
            othReturn: 1002,

            /**
             * Create an alert with the specified message, buttons, and informative text.
             * This alert is intended to warn the user about a current or impending event.
             *
             * This method will instantiate the AlertView and Buttons for you.
             * @method alertWithMessage
             * @param message {string} Title of the alert.
             * @param [defButtonTitle] {string|null} Title for the default button. When null or an empty string, a default button title “OK” is used.
             * @param [altButtonTitle] {string|null} Title for the alternate button. When null, the alternate button is not created.
             * @param [othButtonTitle] {string|null} Title for the other button. When null, the other button is not created.
             * @param [informativeText] {string} Informative text.
             * @returns {AlertView} Initialized AlertView
             */
            alertWithMessage: function (message, defButtonTitle, altButtonTitle, othButtonTitle, informativeText) {
                if (!_.isString(message)) { throw new Error('Expected message to be a string'); }

                var alert = new AlertView(),
                    button;

                alert.setMessage(message);

                if (_.isString(informativeText)) {
                    alert.setInformation(informativeText);
                }

                button = new Button({
                    title: _.isString(defButtonTitle) ? defButtonTitle : 'OK',
                    style: 'btn-primary',
                    tagID: Alert.defReturn,
                    keyEquivalent: ENTER
                });
                alert.setButton('defButton', button);

                if (_.isString(altButtonTitle)) {
                    button = new Button({
                        title: altButtonTitle,
                        tagID: Alert.altReturn
                    });
                    Alert._setKeyEquivalent(button);
                    alert.setButton('altButton', button);
                }

                if (_.isString(othButtonTitle)) {
                    button = new Button({
                        title: othButtonTitle,
                        tagID: Alert.othReturn
                    });
                    Alert._setKeyEquivalent(button);
                    alert.setButton('othButton', button);
                }

                return alert;
            },

            /**
             * Create a critical alert with the specified message, buttons, and informative text.
             * This alert style is intended to warn a user that there might be severe consequences
             * as a result of a certain user response.
             *
             * This style causes the the following changes:
             * - Danger button is styled as "btn-primary"
             * - Danger button has a default keyEquivalent of "ENTER"
             * - Danger button will always be furthest to the left, or topmost depending on device
             * - Danger button will have return value of 1002 (1003 if othButton is defined).
             * - Safe button has a default title of "Cancel"
             * - Safe button has a default keyEquivalent of "ESCAPE"
             *
             * @param message {string} Title of the alert.
             * @param dangerButtonTitle {string} Title for the dangerous action button.
             * @param [safeButtonTitle] {string|null} Title for the safe action button. When null, the safe button title defaults to "Cancel"
             * @param [othButtonTitle] {string|null} Title for the other button. When null, the other button is not created.
             * @param [informativeText] {string} Informative text.
             * @returns {AlertView} Initialized AlertView
             */
            criticalAlertWithMessage: function (message, dangerButtonTitle, safeButtonTitle, othButtonTitle, informativeText) {
                if (!_.isString(message)) { throw new Error('Expected message to be a string'); }
                if (!_.isString(dangerButtonTitle)) {
                    throw new Error('Expected dangerButtonTitle to be a string');
                }

                var alert = new AlertView(),
                    buttons = [],
                    button;

                alert.setMessage(message);

                if (_.isString(informativeText)) {
                    alert.setInformation(informativeText);
                }

                button = new Button({
                    title: _.isString(safeButtonTitle) ? safeButtonTitle : 'Cancel',
                    tagID: Alert.defReturn
                });
                Alert._setKeyEquivalent(button);
                buttons.push(button);

                if (_.isString(othButtonTitle)) {
                    button = new Button({
                        title: othButtonTitle,
                        tagID: Alert.defReturn + buttons.length
                    });
                    Alert._setKeyEquivalent(button);
                    buttons.push(button);
                }

                button = new Button({
                    title: dangerButtonTitle,
                    style: 'btn-primary',
                    tagID: Alert.defReturn + buttons.length,
                    keyEquivalent: ENTER
                });
                buttons.push(button);

                alert.setButtons(buttons);

                return alert;
            },

            /**
             * @method _setKeyEquivalent
             * @param button
             * @private
             */
            _setKeyEquivalent: function (button) {
                var title = button.get('title'),
                    keyEquivalent = button.get('keyEquivalent');

                if (keyEquivalent !== ENTER) {
                    if (title === 'Cancel') {
                        button.set('keyEquivalent', ESCAPE);
                    }
                }
            }
        });

        return Alert;
    }
);
