define(
    ['core/js/forms/basicFormView'],
    function (FormView) {
        'use strict';
        // List of view options to be merged as properties
        var viewOptions = ['validate', 'live', 'liveValidate'];
        return FormView.extend({
            /**
             * A TemplateView that manages a Bootstrap Modal
             * @class ModalView
             * @extends TemplateView
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

            events: function () {
                return _.extend(
                    {
                        'input form': 'liveValidate'
                    },
                    _.result(FormView.prototype, 'events')
                );
            },

            live: false,

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

            validate: function () {
                var $form = this.$('form');
                if (!$form[0].checkValidity()) {
                    var errors = {};
                    $form.find(':invalid').each(function () {
                        var name = this.getAttribute('name'),
                            error = this.validity;
                        errors[name] = error;
                    });
                    return errors;
                }
                return;
            },

            validationError: null,

            isValid: function (options) {
                return this._validate({}, _.extend(options || {}, { validate: true }));
            },

            _validate: function (attrs, options) {
                if (!options.validate || !this.validate) { return true; }
                var error = this.validationError = this.validate(options) || null;
                if (!error) { return true; }
                this.trigger('invalid', this, error, _.extend(options, { validationError: error }));
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
