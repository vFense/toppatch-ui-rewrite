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
                message: 'Alert',
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
                    'click BUTTON:enabled': 'buttonAction'
                });
            },

            constructor: function () {
                DialogView.prototype.constructor.apply(this, arguments);
                this.model = new AlertModel();
                return this;
            },

            createButton: function (options) {
                return _.defaults({}, options, {
                    title: '',
                    tag: null,
                    'btn-style': 'btn-default',
                    keyEquivalent: null
                });
            },

            setButton: function (name, options) {
                if (!_.contains(this.model.buttonNames, name)) { return this; }
                var attributes = {};
                attributes[name] = _.isNull(options) ? null : this.createButton(options);
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
                this._result = $(event.target).data('tagid');
                this.trigger('result', this._result);
                this.hide();
                return this;
            }
        });
    }
);
