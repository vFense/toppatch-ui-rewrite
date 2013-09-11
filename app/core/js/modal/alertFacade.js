define(
    ['core/js/modal/alertView'],
    function (AlertView) {
        'use strict';
        /**
         * Modal Alert Controller
         * @constructor
         */
        var ModalAlert = function () {
            _.extend(this, {
                _messageText: 'Alert',
                _informativeText: '',
                _icon: '',
                _buttons: []
            });
            return this;
        };

        /**
         * Set some non-instanced variables
         */
        _.extend(ModalAlert, {
            FirstButtonReturn: 1000,
            SecondButtonReturn: 1001,
            ThirdButtonReturn: 1002
        });

        /**
         * Set instance variables
         */
        _.extend(ModalAlert.prototype, Backbone.Events, {
            alertWithMessage: function (messageText, defButtonTitle, altButtonTitle, otherButtonTitle, informativeText) {
                if (_.isString(messageText)) {
                    this.messageText(messageText);
                } else {
                    if (_.isUndefined(messageText)) {
                        throw new Error('alertWithMessage expects at least one argument');
                    } else {
                        throw new TypeError('alertWithMessage expects the first argument to be a string');
                    }
                }

                if (_.isString(informativeText)) {
                    this.informativeText(informativeText);
                }

                if (_.isString(defButtonTitle)) {
                    this.addButtonWithTitle(defButtonTitle);
                } else {
                    this.addButtonWithTitle('OK');
                }

                if (_.isString(altButtonTitle)) {
                    this.addButtonWithTitle(altButtonTitle);
                }

                if (_.isString(otherButtonTitle)) {
                    this.addButtonWithTitle(otherButtonTitle);
                }

                return this._runAlert();
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
                if (this._alertView instanceof AlertView) {
                    this._alertView.close();
                    this.stopListening(this._alertView);
                }
                var alert = this._alertView = new AlertView();
                alert.setMessage(this._messageText)
                    .setInformation(this._informativeText)
                    .setButtons(this._buttons);
                return alert;
            },

            _runAlert: function () {
                var alert = this._setupAlert().open();
                this.listenToOnce(alert, 'result', function () {});
                return this;
            }
        });

        return ModalAlert;
    }
);