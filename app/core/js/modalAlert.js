define(
    ['core/js/modalAlertView'],
    function (AlertView) {
        'use strict';

        /**
         * Alert Panel Controller
         * @constructor
         */
        var ModalAlert = function () {
            this.view = new AlertView();
        };

        _.extend(ModalAlert, {
            FirstButtonReturn: 1000,
            SecondButtonReturn: 1001,
            ThirdButtonReturn: 1002
        });

        _.extend(ModalAlert.prototype, {
            // Alert View Attributes
            _alertStyle: 'info',
            _messageText: 'Alert',
            _informativeText: '',
            _icon: '',
            _buttons: [],

            addButtonWithTitle: function (title) {
                var button = {},
                    count = this._buttons.length;

                button.title = title;

                if (count === 0) {
                    button.tag = ModalAlert.FirstButtonReturn;
                    button.keyEquivalent = KEY_CODES.RETURN;
                } else {
                    button.tag = ModalAlert.FirstButtonReturn + count;
                    this.setKeyEquivalent(button);
                }
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