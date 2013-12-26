define(
    [
        'core/js/views/modal/modal',
        'core/template/modalAlert',
        'core/js/control/button',
        'core/js/TopPatch/constants'
    ],
    function (ModalView, alertTemplate, Button, constants) {
        'use strict';

        var ENTER = constants.KEYS.ENTER,
            ESCAPE = constants.KEYS.ESCAPE,
            AlertView;

        AlertView = ModalView.extend(
            /************************
             * Prototype Properties *
             ************************/
            {
                /**
                 * Display an alert in a modal
                 *
                 * By design, the `AlertView` is intended for a single alert—that is, an alert
                 * with a unique combination of title, buttons, and so on—that is displayed
                 * upon a particular condition. You should create a new `AlertView` for each
                 * alert dialog. If you have a particular alert dialog that you need to show
                 * repeatedly, you can retain an instance of `AlertView` for this dialog.
                 *
                 * For easier use, use the static methods [alertWithMessage](#method_alertWithMessage) and
                 * [criticalAlertWithMessage](#method_criticalAlertWithMessage)
                 *
                 * @class AlertView
                 * @extends ModalView
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
                    ModalView.prototype.constructor.apply(this, arguments);
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
                    return _.extend({}, _.result(ModalView.prototype, 'attributes'), {
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
                 * Extends the ModalView events
                 * @attribute events
                 * @type Object|Function
                 * @default Object
                 * @protected
                 */
                events: _.extend({
                    'click BUTTON:enabled': 'clickEventHandler',
                    'keyup': 'keyEventHandler'
                }, _.result(ModalView.prototype, 'events')),

                /**
                 * Render this view
                 * @method render
                 * @chainable
                 * @returns {this}
                 */
                render: function () {
                    // Render
                    ModalView.prototype.render.apply(this, arguments);

                    // Post Render tasks
                    var $buttonArea = this.$('.modal-footer');

                    // The following logic assumes that this.buttons()
                    // always returns the buttons in the correct order:
                    // [defButton, altButton, othButton]
                    _.each(this.buttons(), function (button) {
                        if (button !== null) {
                            $buttonArea.prepend(button.render().$el);
                        }
                    });

                    return this;
                },

                /**
                 * Open this View
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
                    this.result = null;
                    return ModalView.prototype.open.apply(this, arguments);
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
                        ModalView.prototype.close.apply(this, arguments);
                    }
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
                    _.each(this.buttons(), function (button) {
                        var keyMatched = false;
                        if (!_.isNull(button)) {
                            keyMatched = button.performKeyEquivalent(event, this.animate);
                        }
                        // Continue the `each` loop if key has not been matched yet
                        return !keyMatched;
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
                    this.result = $target.data('returnValue');
                    this.trigger('result', this.result);
                    return this.hide();
                }
            },

            /*********************
             * Static Properties *
             *********************/
            {
                /**
                 * The return value if the default button is pressed
                 * @attribute defReturn
                 * @type Number
                 * @default 1000
                 * @static
                 * @final
                 */
                defReturn: 1000,
                /**
                 * The return value if the alternate button is pressed
                 * @attribute altReturn
                 * @type Number
                 * @default 1001
                 * @static
                 * @final
                 */
                altReturn: 1001,
                /**
                 * The return value if the other button is pressed
                 * @attribute othReturn
                 * @type Number
                 * @default 1002
                 * @static
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
                 * @static
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
                        returnValue: AlertView.defReturn,
                        keyEquivalent: ENTER
                    });
                    alert.setButton('defButton', button);

                    if (_.isString(altButtonTitle)) {
                        button = new Button({
                            title: altButtonTitle,
                            returnValue: AlertView.altReturn
                        });
                        AlertView._setKeyEquivalent(button);
                        alert.setButton('altButton', button);
                    }

                    if (_.isString(othButtonTitle)) {
                        button = new Button({
                            title: othButtonTitle,
                            returnValue: AlertView.othReturn
                        });
                        AlertView._setKeyEquivalent(button);
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
                 * @method criticalAlertWithMessage
                 * @param message {string} Title of the alert.
                 * @param dangerButtonTitle {string} Title for the dangerous action button.
                 * @param [safeButtonTitle] {string|null} Title for the safe action button. When null, the safe button title defaults to "Cancel"
                 * @param [othButtonTitle] {string|null} Title for the other button. When null, the other button is not created.
                 * @param [informativeText] {string} Informative text.
                 * @returns {AlertView} Initialized AlertView
                 * @static
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
                        returnValue: AlertView.defReturn
                    });
                    AlertView._setKeyEquivalent(button);
                    buttons.push(button);

                    if (_.isString(othButtonTitle)) {
                        button = new Button({
                            title: othButtonTitle,
                            returnValue: AlertView.defReturn + buttons.length
                        });
                        AlertView._setKeyEquivalent(button);
                        buttons.push(button);
                    }

                    button = new Button({
                        title: dangerButtonTitle,
                        style: 'btn-primary',
                        returnValue: AlertView.defReturn + buttons.length,
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
                 * @static
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
            }
        ); // End ModalView.extend

        return AlertView;
    }
);
