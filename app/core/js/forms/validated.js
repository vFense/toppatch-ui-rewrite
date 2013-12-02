define(
    ['core/js/forms/basicFormView'],
    function (FormView) {
        'use strict';
        // List of view options to be merged as properties
        var viewOptions = ['validate'];
        return FormView.extend({
            /**
             * A TemplateView that manages a Bootstrap Modal
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
                FormView.prototype.constructor.apply(this, arguments);
                return this;
            },

            /**
             * @attribute validate
             * @type {null|function}
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
            },

            submit: function (event) {
                if (_.isObject(event)) { event.preventDefault(); }
                if (this.isValid()) {
                    this.trigger('submit', this.serializeForm());
                }
                return this;
            }
        });
    }
);
