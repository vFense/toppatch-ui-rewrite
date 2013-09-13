/**
 * alertView
 */
define(
    ['core/js/modal/dialogView', 'core/js/template/modalAlert'],
    function (DialogView, alertTemplate) {
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

            constructor: function () {
                this.model = new AlertModel();
                return DialogView.prototype.constructor.apply(this, arguments);
            },

            createButton: function (options) {
                var button = _.defaults({}, options, {
                    title: 'No Title',
                    tag: null,
                    'btn-style': 'btn-default',
                    keyEquivalent: null
                });
                if (_.isString(button.keyEquivalent)) {
                    button.keyEquivalent = button.keyEquivalent.charCodeAt(0);
                }
                return button;
            },

            setButton: function (name, options) {
                if (_.contains(this.model.buttonNames, name)) {
                    var attributes = {};
                    attributes[name] = _.isNull(options) ? null : this.createButton(options);
                    this.model.set(attributes);
                }
                return this;
            },

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

            open: function () {
                if (this.model.get('message') === '') {
                    throw new Error('Cannot open Alert: Alert message is empty');
                } else if (_.isNull(this.model.get('defButton'))) {
                    throw new Error('Cannot open Alert: DefaultButton is null');
                }
                DialogView.prototype.open.apply(this, arguments);
                return this;
            }
        });
    }
);
