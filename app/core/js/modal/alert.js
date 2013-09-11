/**
 * modalAlertView
 * --------------------------------------------------------------------
 * This file is intended to be used via modalAlert.js
 */
define(
    ['core/js/dialogView', 'core/js/template/modalAlert'],
    function (DialogView, alertTemplate) {
        'use strict';

        /**
         * Default model for an Alert Button
         * @type {Backbone.Model}
         */
        var AlertButton = Backbone.Model.extend({
            defaults: {
                title: '',
                tag: null,
                'btn-style': 'btn-default',
                keyEquivalent: null
            }
        });

        /**
         * Default model for an Alert
         * @type {Backbone.Model}
         */
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

        /**
         * The Alert View
         * @type {Backbone.View}
         */
        var AlertView = DialogView.extend({
            template: alertTemplate,

            // el Attributes
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
                    'click BUTTON:enabled': 'buttonAction'
                });
            },

            constructor: function () {
                DialogView.prototype.constructor.apply(this, arguments);
                this.model = new AlertModel();
                return this;
            },

            setButton: function (name, options) {
                if (!_.contains(this.model.buttonNames, name)) { return this; }
                var attributes = {};
                attributes[name] = _.isNull(options) ? null : new AlertButton(options);
                this.model.set(attributes);
                return this;
            },

            setButtons: function (buttons) {
                var count = buttons.length;
                this.setButton('defButton', count > 0 ? buttons[0] : null);
                this.setButton('altButton', count > 1 ? buttons[1] : null);
                this.setButton('othButton', count > 2 ? buttons[2] : null);
                return this;
            },

            setMessage: function (text) {
                if (_.isString(text)) {
                    this.model.set({message: text});
                }
                return this;
            },

            setInformation: function (text) {
                if (_.isString(text)) {
                    this.model.set({information: text});
                }
                return this;
            },

            _result: null,
            buttonAction: function (event) {
                $.noop(event);
                return this;
            }
        });

        /**
         * Modal Alert Controller
         * @constructor
         */
        var ModalAlert = function () {
            var Collection = Backbone.Collection.extend({
                model: AlertButton
            });
            _.extend(this, {
                _messageText: 'Alert',
                _informativeText: '',
                _icon: '',
                _buttons: new Collection()
            });
            return this;
        };

        /**
         * Set some non-instanced variables
         */
        _.extend(ModalAlert, {
            FirstButtonReturn: 1000,
            SecondButtonReturn: 1001,
            ThirdButtonReturn: 1002,

            // Save References for testing purposes
            AlertButton: AlertButton,
            AlertModel: AlertModel,
            AlertView: AlertView
        });

        /**
         * Set instance variables
         */
        _.extend(ModalAlert.prototype, Backbone.Events, {
            alertWithMessage: function (messageText, defButtonTitle, altButtonTitle, otherButtonTitle, informativeText) {
                this.setMessageText(messageText);

                if (_.isString(informativeText)) {
                    this.setInformativeText(informativeText);
                }

                if (_.isString(defButtonTitle)) {
                    this.addButtonWithTitle(defButtonTitle);
                } else {
                    this.addButtonWithTitle('OK');
                }



                return this;
            },

            _setText: function (reference, text) {
                if (!_.isUndefined(text) && _.isString(text)) {
                    this[reference] = text.trim;
                }
                return this[reference];
            },

            messageText: function (text) {
                if (_.isString(text)) { this._messageText = text.trim; }
                return this._messageText;
            },

            informativeText: function (text) {
                if (_.isString(text)) { this._informativeText = text.trim; }
                return this._informativeText;
            },

            icon: function () {
                return this._icon;
            },

            addButtonWithTitle: function (title) {
                title = title.trim();

                var button = {},
                    count = this._buttons.length;

                button.title = title.trim();

                if (count === 0) {
                    button['btn-style'] = 'btn-primary';
                    button.tag = ModalAlert.FirstButtonReturn;
                    button.keyEquivalent = '\r';
                } else {
                    button.tag = ModalAlert.FirstButtonReturn + count;
                    this.setKeyEquivalent(button);
                }

                this._buttons.add(button);
                return button;
            },

            setKeyEquivalent: function (button) {
                var title = button.title;
                if (button.keyEquivalent !== '\r') {
                    if (title === 'Cancel') {
                        // Any button with a title of “Cancel”
                        // has a key equivalent of Escape (\x1B)
                        button.keyEquivalent = '\x1B';
                    } else {
                        button.keyEquivalent = null;
                    }
                }
                return this;
            },

            buttons: function () {
                return this._buttons;
            },

            _setupAlert: function () {
                if (this._alertView instanceof DialogView) {
                    this._alertView.close();
                    this.stopListening(this._alertView);
                }
                var alert = this._alertView = new AlertView();
                alert.setMessage(this._messageText)
                     .setInformation(this._informativeText)
                     .setButtons(this._buttons);
                return alert;
            },

            runAlert: function () {
                var alert = this._setupAlert().open();
                this.listenToOnce(alert, 'result', function () {});
                return this;
            }
        });

        return ModalAlert;
    }
);
