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
            defReturn: 1000,
            altReturn: 1001,
            othReturn: 1002,

            /**
             * Create an alert with the specified message, buttons, and informative text.
             *
             * This method will instantiate the AlertView and Buttons for you.
             * @method alertWithMessage
             * @param message {string} Title of the alert.
             * @param [defButtonTitle] {string|null} Title for the default button. When null or an empty string, a default button title “OK” is used.
             * @param [altButtonTitle] {string|null} Title for the alternate button. When null, the alternate button is not created.
             * @param [othButtonTitle] {string|null} Title for the other button. When null, the other button is not created.
             * @param [informativeText] {string|function} Informative text. Can be a handlebars, or underscore, template.
             * @returns {AlertView} Initialized AlertView
             */
            alertWithMessage: function (message, defButtonTitle, altButtonTitle, othButtonTitle, informativeText) {
                if (!_.isString(message)) { throw new Error('Expected message to be a string'); }

                var alert = new AlertView(),
                    button;

                alert.setMessage(message);

                if (!_.isUndefined(informativeText)) {
                    var text = informativeText;
                    if (_.isFunction(text)) {
                        text = text();
                    }
                    alert.setInformation(text);
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

                button = undefined; // Release the button reference
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
