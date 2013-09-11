/**
 * modalAlertView
 * --------------------------------------------------------------------
 * This file is intended to be used via modalAlert.js
 */
define(
    ['core/js/dialogView', 'core/js/template/modalAlertView'],
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
                titleField: '',
                messageField: '',
                defButton: null,
                altButton: null,
                othButton: null
            },
            fieldNames: ['titleField', 'messageField'],
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
                this.model.set({
                    'defButton': count > 0 ? buttons[0] : null,
                    'altButton': count > 1 ? buttons[1] : null,
                    'othButton': count > 2 ? buttons[2] : null
                });
                return this;
            },

            setKeyEquivalent: function (button) {
                var title = button.title;
                if (button.keyEquivalent !== '\r') {
                    if (title.toLowerCase() === 'cancel') {
                        // Any button with a title of “Cancel”
                        // has a key equivalent of Escape (\x1B)
                        button.keyEquivalent = '\x1B';
                    } else {
                        button.keyEquivalent = '';
                    }
                }
                return this;
            },

            result: null,
            buttonAction: function (event) {
                $.noop(event);
                return this;
            },

            resetAlert: function () {
                this.model = new AlertModel();
                return this;
            }
        });

        /**
         * Modal Alert Controller
         * @constructor
         */
        var ModalAlert = function () {
            this.alertView = new AlertView();
        };

        _.extend(ModalAlert, {
            FirstButtonReturn: 1000,
            SecondButtonReturn: 1001,
            ThirdButtonReturn: 1002,

            // Save References for testing purposes
            AlertButton: AlertButton,
            AlertModel: AlertModel,
            AlertView: AlertView
        });

        _.extend(ModalAlert.prototype, {
            // Alert View Attributes
            _alertStyle: 'info',
            _messageText: 'Alert',
            _informativeText: '',
            _icon: '',
            _buttons: [],

            alertWithMessage: function (messageText, defButtonTitle, altButtonTitle, otherButtonTitle, informativeText) {
                this.setMessageText(messageText);

                if (_.isString(information)) {
                    this.setInformativeText(information);
                }

                if (_.isString(defButtonTitle)) {
                    this.addButtonWithTitle(defButtonTitle);
                } else {
                    this.addButtonWithTitle('OK');
                }



                return this;
            },

            setMessageText: function (text) {
                this._messageText = text.trim();
            },

            setInformativeText: function (text) {
                this._informativeText = text.trim();
                return this;
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
                    button['btn-style'] = 'btn-default';
                    button.tag = ModalAlert.FirstButtonReturn + count;
                    this.setKeyEquivalent(button);
                }

                this.buttons.push(button);
                return button;
            },

            setAlertStyle: function (style) {
                if (_.isString(style)) {
                    this.$el
                        .removeClass(this.alertStyle)
                        .addClass(style);
                    this.alertStyle = style;
                }
                return this;
            }
        });

        return ModalAlert;
    }
);
