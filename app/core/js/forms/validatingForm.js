define(
    ['core/js/forms/basicFormView'],
    function (FormView) {
        'use strict';
        // List of view options to be merged as properties
        var viewOptions = ['validate', 'live', 'liveValidate'];
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
                        'input form': 'liveValidate'
                    },
                    _.result(FormView.prototype, 'events')
                );
            },

            /**
             * Enable/disable input validity check on each input event
             * @attribute live
             * @type boolean
             * @default true
             * @protected
             */
            live: false,

            /**
             * Method to test an individual input event target for validity
             * @method liveValidate
             * @param event
             * @chainable
             */
            liveValidate: function (event) {
                if (this.live) {
                    var target = event.target,
                        $target = $(target),
                        $parent = $target.closest('.form-group'),
                        invalid = !target.validity.valid;
                    $parent.toggleClass('has-error', invalid);
                }
                return this;
            },

            /**
             * Validate the entire form in one go
             * @method validate
             * @returns {*} Returns a "truthy" value if there is an error
             */
            validate: function () {
                var $form = this.$('form'),
                    error = null;
                $form.find(':valid')
                    .closest('.form-group')
                    .toggleClass('has-error', false)
                ;
                if (!$form[0].checkValidity()) {
                    var $invalid = $form.find(':invalid');
                    $invalid.closest('.form-group')
                        .toggleClass('has-error', true)
                    ;
                    $invalid.first().focus();
                    error = this.parseValidity($invalid[0]);
                }
                return error;
            },

            parseValidity: function (element) {
                var name = element.getAttribute('name'),
                    label = $('label[for="' + element.getAttribute('id') + '"]').text(),
                    validity = element.validity,
                    out = [label || name];
                if (validity.valueMissing) {
                    out.push('is required.');
                } else if (validity.patternMismatch) {
                    out.push('does not match the specified pattern.');
                } else if (validity.typeMismatch) {
                    out.push('is not a valid', element.getAttribute('type'), '.');
                } else if (validity.rangeOverflow) {
                    out.push('is greater than', element.getAttribute('max'), '.');
                } else if (validity.rangeUnderflow) {
                    out.push('is less than', element.getAttribute('min'), '.');
                } else if (validity.stepMismatch) {
                    out.push('is not a multiple of', element.getAttribute('step'), '.');
                } else if (validity.tooLong) {
                    out.push('is too long.');
                } else {
                    out.push(element.validationMessage);
                }
                return out.join(' ');
            },

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
