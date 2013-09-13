/**
 * alertView
 */
define(
    ['core/js/modal/dialogView', 'core/js/template/modalAlert', 'core/js/button'],
    function (DialogView, alertTemplate, Button) {
        'use strict';

        var AlertModel = Backbone.Model.extend({
            defaults: {
                icon: null,
                message: '',
                information: '',
                defButton: null,
                altButton: null,
                othButton: null
            },
            fieldNames: ['message', 'information'],
            buttonNames: ['defButton', 'altButton', 'othButton']
        });

        return DialogView.extend({
            template: alertTemplate,

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
                    'click BUTTON:enabled': 'buttonAction',
                    'keydown': 'keyAction'
                });
            },

            /**
             * Construct this DialogView
             * @constructor
             * @returns {number}
             */
            constructor: function () {
                this.model = new AlertModel();
                return DialogView.prototype.constructor.apply(this, arguments);
            },

            /**
             * Set a button instance
             * @param name {string} Name of the button to set
             * @param button {core/js/button.View|null}
             * @returns {this}
             */
            setButton: function (name, button) {
                // Short circuit only set for names we want
                if (_.contains(this.model.buttonNames, name)) {
                    if (_.isNull(button)) {
                        this.model.set(name, null);
                    } else if (button instanceof Button.View) {
                        this.model.set(name, button);
                    } else {
                        throw new TypeError('setButton(name, button): expected button to be instance of Button.View or null');
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

            setMessage: function (text) {
                if (_.isString(text)) {
                    this.model.set({message: text.trim()});
                }
                return this;
            },

            setInformation: function (text) {
                if (_.isString(text)) {
                    this.model.set({information: text});
                }
                return this;
            },

            keyAction: function (event) {
                var keyCode = event.which, // jQuery normalizes the 'which' property
                    buttons = this.model.pick(this.model.buttonNames),
                    match = _.find(buttons, function (button) {
                        return _.result(button, 'keyEquivalent') === keyCode;
                    });

                if (_.isObject(match)) {
                    this._result = match.tag;
                    this.trigger('result', this._result);
                    this.hide();
                }

                return this;
            },

            _result: null,
            buttonAction: function (event) {
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
                if (this.model.get('message') === '') {
                    throw new Error('Cannot open Alert: Alert message is empty');
                } else if (_.isNull(this.model.get('defButton'))) {
                    throw new Error('Cannot open Alert: DefaultButton is null');
                }
                DialogView.prototype.open.apply(this, arguments);
                return this;
            },

            /**
             * Close this View
             * ---
             * Currently this  method also conducts a full reset of this.model
             * Which would prevent the reuse of this view. Is this the best
             * solution? Is there a use case for reusing the view?
             *
             * @override
             * @returns {*}
             */
            close: function () {
                if (!this.isClosed) {
                    // Close/Remove the buttons views
                    var buttons = _.pick(this.model.attributes, this.model.buttonNames);
                    _.each(buttons, function (button) {
                        if (_.isFunction(button.close)) {
                            button.close();
                        } else if (_.isFunction(button.remove)) {
                            button.remove();
                        }
                    }, this);

                    // Reset this.model to its default state
                    this.model.clear().set(this.model.defaults);

                    // Call the prototype close method
                    DialogView.prototype.close.apply(this, arguments);
                }
                return this;
            }
        });
    }
);
