/**
 * alertView
 */
define(
    ['core/js/modal/dialogView', 'core/js/template/modalAlert', 'core/js/button'],
    function (DialogView, alertTemplate, Button) {
        'use strict';

        return DialogView.extend({
            template: alertTemplate,

            constructor: function (options) {
                var defaults = {
                        // Alert properties
                        icon: null,
                        message: '',
                        information: '',
                        defButton: null,
                        altButton: null,
                        othButton: null
                    },
                    defaultKeys = _.keys(defaults);
                _.defaults(this, _.pick(options || {}, defaultKeys), defaults);
                return DialogView.prototype.constructor.apply(this, arguments);
            },

            attributes: function () {
                return _.extend({}, _.result(DialogView.prototype, 'attributes'), {
                    'role': 'alertdialog'
                });
            },

            // Dialog View Attribute Override
            // The alert itself will handle keyboard events
            keyboard: false,    // Disable Bootstrap.modal keyboard events
            backdrop: 'static', // Disable close on backdrop click

            /**
             * Listen for button clicks
             * Use a function so we can inherit events
             * @returns {Object}
             */
            events: function () {
                return _.extend({}, _.result(DialogView.prototype, 'events'), {
                    'click BUTTON:enabled': 'clickAction',
                    'keypress': 'keyAction'
                });
            },

            /**
             * Function that returns an object containing
             * references to each of this view's buttons
             * @returns {Object}
             */
            buttons: function () {
                return _.pick(this, 'defButton', 'altButton', 'othButton');
            },

            getData: function () {
                return _.extend({}, _.pick(this, 'icon', 'message', 'information'), this.buttons());
            },

            /**
             * Set a button instance
             * @param name {string} Name of the button to set
             * @param button {core/js/button|null}
             * @returns {this}
             */
            setButton: function (name, button) {
                // Short circuit only set for names we want
                if (_.has(this.buttons(), name)) {
                    if (_.isNull(button) || (button instanceof Button)) {
                        this[name] = button;
                    } else {
                        throw new TypeError('Expected button to be instance of Button or null');
                    }
                }
                return this;
            },

            /**
             * Set the three buttons of concern with one call. This method will
             * @param buttons {array} An array of up to 3 buttons to add to this.model
             * @returns {*}
             */
            setButtons: function (buttons) {
                if (_.isArray(buttons)) {
                    var count = buttons.length;
                    this.setButton('defButton', count > 0 ? buttons[0] : null);
                    this.setButton('altButton', count > 1 ? buttons[1] : null);
                    this.setButton('othButton', count > 2 ? buttons[2] : null);
                }
                return this;
            },

            /**
             * Convenience method to set this alert.model's message
             * @param text
             * @returns {*}
             */
            setMessage: function (text) {
                if (_.isString(text)) {
                    this.message = text.trim();
                }
                return this;
            },

            /**
             * Convenience method to set this alert.model's information
             * @param text
             * @returns {*}
             */
            setInformation: function (text) {
                if (_.isString(text)) {
                    this.information = text.trim();
                }
                return this;
            },

            /**
             * On every keypress, run each button's performKeyEquivalent method
             * @param event
             * @returns {*}
             */
            keyAction: function (event) {
                // Run each button's performKeyEquivalent
                // Funky things will happen if there is more than one matching button
                _.invoke(this.buttons(), 'performKeyEquivalent', event);

                return this;
            },

            _result: null,
            clickAction: function (event) {
                this._result = $(event.target).data('tagid');
                this.trigger('result', this._result);
                this.hide();
                return this;
            },

            /**
             * Open this View
             * ---
             * Only open if there is a message and a default button
             *
             * @returns {*}
             */
            open: function () {
                if (this.message === '') {
                    throw new Error('Cannot open Alert: Alert message is empty');
                } else if (_.isNull(this.defButton)) {
                    throw new Error('Cannot open Alert: DefaultButton is null');
                }
                DialogView.prototype.open.apply(this, arguments);
                return this;
            },

            /**
             * Close this View
             * ---
             * Currently this method removes the button elements, and sets each
             * button reference to null. This would cause the View to not be reusable
             * without further setup.
             * Is there a use case for reusing the view?
             *
             * @override
             * @returns {*}
             */
            close: function () {
                if (!this.isClosed) {
                    // Remove the buttons for garbage collection
                    _.invoke(this.buttons(), 'remove');

                    // Call the prototype close method
                    DialogView.prototype.close.apply(this, arguments);
                }
                return this;
            }
        });
    }
);
