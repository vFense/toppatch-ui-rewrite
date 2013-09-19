define(
    ['core/js/modal/dialogView', 'core/js/template/modalAlert', 'core/js/button'],
    function (DialogView, alertTemplate, Button) {
        'use strict';

        return DialogView.extend({
            /**
             * Display an alert in a modal
             *
             * By design, the `AlertView` is intended for a single alert—that is, an alert
             * with a unique combination of title, buttons, and so on—that is displayed
             * upon a particular condition. You should create a new `AlertView` for each
             * alert dialog. If you have a particular alert dialog that you need to show
             * repeatedly, you can retain an instance of `AlertView` for this dialog.
             *
             * @class AlertView
             * @extends DialogView
             * @requires Button
             * @constructor
             * @param options {Object} Properties to init this AlertView with
             * @example new AlertView({title: 'Alert', defButton: new Button()});
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
             * @attribute template
             * @type Function
             * @default Default alert template
             * @protected
             */
            template: alertTemplate,

            /**
             * A hash of attributes that will be set as HTML DOM element
             * attributes on the view's el (id, class, data-properties, etc.),
             * or a function that returns such a hash.
             * @attribute attributes
             * @type String|Function
             * @default Function
             * @protected
             */
            attributes: function () {
                return _.extend({}, _.result(DialogView.prototype, 'attributes'), {
                    'role': 'alertdialog'
                });
            },

            /**
             * @attribute keyboard
             * @type boolean
             * @default false
             * @protected
             */
            keyboard: false,

            /**
             * @attribute backdrop
             * @type boolean|'static'
             * @default 'static'
             * @protected
             */
            backdrop: 'static',

            /**
             * Listen for button clicks
             * Uses a function to inherit events
             * @attribute events
             * @type String|Function
             * @default Function
             */
            events: function () {
                return _.extend({}, _.result(DialogView.prototype, 'events'), {
                    'click BUTTON:enabled': 'clickEventHandler',
                    'keypress': 'keyEventHandler'
                });
            },

            /**
             * Render this view
             * @method render
             * @chainable
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
             * @method buttons
             * @returns {Object}
             */
            buttons: function () {
                return _.pick(this, ['defButton', 'altButton', 'othButton']);
            },

            /**
             * Get the properties that will be passed to the template
             * @method getData
             * @override
             * @returns {Object}
             */
            getData: function () {
                return _.extend({}, _.pick(this, 'icon', 'message', 'information'));
            },

            /**
             * Set a button instance
             * @method setButton
             * @param name {string} Name of the button to set
             * @param button {Button|null}
             * @chainable
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
             * @method setButtons
             * @param buttons {array} An array of up to 3 buttons to add to this.model
             * @chainable
             * @returns {this}
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
             * @method setMessage
             * @param text
             * @chainable
             * @returns {this}
             */
            setMessage: function (text) {
                if (_.isString(text)) {
                    this.message = text.trim();
                }
                return this;
            },

            /**
             * Convenience method to set this alert.model's information
             * @method setInformation
             * @param text
             * @chainable
             * @returns {this}
             */
            setInformation: function (text) {
                if (_.isString(text)) {
                    this.information = text.trim();
                }
                return this;
            },

            /**
             * On every keypress, run each button's performKeyEquivalent method
             * @method keyEventHandler
             * @param event {Event}
             * @chainable
             * @returns {this}
             * @protected
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
             * Handle the click event
             * @method clickEventHandler
             * @param event {Event}
             * @chainable
             * @returns {this}
             * @protected
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
             * @method open
             * @chainable
             * @override
             * @returns {this}
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
             * Remove the buttons from this.el, then close this view
             * @method close
             * @chainable
             * @override
             * @returns {this}
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
