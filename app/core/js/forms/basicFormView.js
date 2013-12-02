/**
 * A TemplateView that manages a Form
 * @class basicFormView
 * @extends TemplateView
 */
define(
    ['core/js/templateView'],
    function (TemplateView) {
        'use strict';
        var viewOptions = ['validate'];

        return TemplateView.extend({
            /**
             * A TemplateView that manages a form's submission
             * @class ValidatingForm
             * @extends BasicFormView
             * @constructor
             * @param options
             * @returns {this}
             */
            constructor: function (options) {
                if (_.isObject(options)) {
                    _.extend(this, _.pick(options, viewOptions));
                }
                TemplateView.prototype.constructor.apply(this, arguments);
                return this;
            },

            /**
             * Function to validate the form with
             * @attribute validate
             * @type {function}
             * @default null
             */
            validate: null,

            /**
             * The value returned during the last failed validation
             * @attribute {*} validationError
             * @default null
             */
            validationError: null,

            /**
             * Listen for DOM element events
             * Uses a function to inherit events
             * @attribute events
             * @type Object|Function
             * @default Function
             * @protected
             */
            events: function () {
                return _.extend(
                    {
                        'submit form': 'submit'
                    },
                    _.result(TemplateView.prototype, 'events')
                );
            },

            /**
             * Serialize the form and trigger the submit event at the backbone level
             * @method submit
             * @param event {Event}
             * @returns {this}
             */
            submit: function (event) {
                if (_.isObject(event)) { event.preventDefault(); }
                if (this.isValid()) {
                    this.trigger('submit', this.serializeForm());
                }
                return this;
            },

            /**
             * Serialize the form into an Object ready for conversion to JSON
             * @method serializeForm
             * @returns {Object}
             * @protected
             */
            serializeForm: function () {
                var output = {};
                var input = this.$('form').serializeArray();
                $.each(input, function() {
                    if (output[this.name] !== undefined) {
                        if (!output[this.name].push) {
                            output[this.name] = [output[this.name]];
                        }
                        output[this.name].push(this.value || '');
                    } else {
                        output[this.name] = this.value || '';
                    }
                });
                return output;
            },

            /**
             * Check if the form is currently in a valid state.
             * @method isValid
             * @returns {boolean}
             */
            isValid: function () {
                return this._validate();
            },

            _validate: function () {
                if (!this.validate) { return true; }
                var error = this.validationError = this.validate() || null;
                if (!error) { return true; }
                this.trigger('invalid', this, error);
                return false;
            }
        });
    }
);
