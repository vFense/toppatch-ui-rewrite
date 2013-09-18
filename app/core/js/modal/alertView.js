/**
 * @class AlertView
 * @extends DialogView
 * @requires Button
 */
define(
    ['core/js/modal/dialogView', 'core/js/template/modalAlert', 'core/js/button'],
    function (DialogView, alertTemplate, Button) {
        'use strict';

        return DialogView.extend({
            template: alertTemplate,

            /**
             * Construct this AlertView
             * @constructor AlertView
             * @param options {Object} Properties to init this AlertView with
             * @returns {this}
             */
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
                DialogView.prototype.constructor.apply(this, arguments);
                return this;
            },

            /**
             * Extend the prototype's attributes
             * @returns {Object}
             */
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
                    'click BUTTON:enabled': 'clickEventHandler',
                    'keypress': 'keyEventHandler'
                });
            },

            /**
             * Render this view
             * @returns {this}
             */
            render: function () {
                // Render
                DialogView.prototype.render.apply(this, arguments);

                // Post Render tasks
                var $buttonArea = this.$('.modal-alert-buttons');

                // The following logic assumes that this.buttons()
                // always returns the buttons in the correct order:
                // [defButton, altButton, othButton]
                _.each(this.buttons(), function (button) {
                    if (button !== null) {
                        $buttonArea.prepend(_.result(button, '$el'));
                    }
                });

                return this;
            },

            /**
             * Function that returns an object containing
             * references to each of this view's buttons
             * @returns {Object}
             */
            buttons: function () {
                return _.pick(this, ['defButton', 'altButton', 'othButton']);
            },

            /**
             * Get the properties that will be passed to the template
             * @override
             * @returns {Object}
             */
            getData: function () {
                return _.extend({}, _.pick(this, 'icon', 'message', 'information'));
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
            keyEventHandler: function (event) {
                // Run each button's performKeyEquivalent
                // Funky things will happen if there is more than one matching button
                _.each(this.buttons(), function (button) {
                    if (!_.isNull(button)) {
                        button.performKeyEquivalent(event, this.animate);
                    }
                }, this);

                return this;
            },

            result: null,

            /**
             *
             * @param event
             * @returns {*}
             */
            clickEventHandler: function (event) {
                var $target = $(event.target);
                this.result = $target.data('tagID');
                this.trigger('result', this.result);
                return this.hide();
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
                } else if (!(this.defButton instanceof Button)) {
                    throw new TypeError('Cannot open Alert: defButton is not an instance of Button');
                }
                return DialogView.prototype.open.apply(this, arguments);
            },

            /**
             * Close this View
             * @override
             * @returns {*}
             */
            close: function () {
                if (!this.isClosed) {
                    // Remove the buttons for garbage collection
                    _.each(this.buttons(), function (button) {
                        _.result(button, 'remove');
                    });

                    // Call the prototype close method
                    DialogView.prototype.close.apply(this, arguments);
                }
                return this;
            }
        });
    }
);
