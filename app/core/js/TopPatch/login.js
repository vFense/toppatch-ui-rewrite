define(
    ['core/js/forms/form', 'core/template/login'],
    function (Form, template) {
        'use strict';

        // Temporary code until i18n is complete
        var formHelpers = {
            getLabel: function (element) {
                return element.labels[0].innerText || element.title || element.name || element.id || 'Field';
            }
        };

        var i18n = {
            form: {
                badInput: _.template('<%= getLabel(element) %>'),
                customError: _.template('<%= getLabel(element) %>: element.validationMessage'),
                patternMismatch: _.template('<%= getLabel(element) %> does not match the specified pattern'),
                rangeOverflow: _.template('<%= getLabel(element) %> is greater than <%= element.getAttribute("max") %>'),
                rangeUnderflow: _.template('<%= getLabel(element) %> is less than <%= element.getAttribute("min") %>'),
                stepMismatch: _.template('<%= getLabel(element) %> is not a multiple of <%= element.getAttribute("step") %>'),
                tooLong: _.template('<%= getLabel(element) %> is too long.'),
                typeMismatch: _.template('<%= getLabel(element) %> is not a valid <%= element.getAttrigute("type") %>'),
                valid: _.template('<%= getLabel(element) %> is valid.'),
                valueMissing: _.template('<%= getLabel(element) %> is required.')
            }
        };
        // End temp code

        return Form.extend({
            template: template,
            loginResponse: '',
            initialize: function () {
                this.on('invalid', this.renderError);
                this.on('submit', this.signIn);
                return this;
            },
            validate: function () {
                var $form = this.$('form'),
                    out = null;
                if (!$form[0].checkValidity()) {
                    var $invalid = $form.find(':invalid'),
                        $first = $invalid.first(),
                        validity = $first[0].validity,
                        error = _.findKey(validity, function (value) { return value === true; });
                    out = i18n.form[error](_.extend({}, {element: $first[0]}, formHelpers));
                }
                return out;
            },
            renderError: function (error) {
                this.$('.alert')
                    .toggleClass('hide', !error)
                    .html(error)
                ;
                this.$(':valid')
                    .closest('.form-group')
                        .toggleClass('has-error', false)
                ;
                this.$(':invalid')
                    .closest('.form-group')
                        .toggleClass('has-error', true)
                    .end()
                    .first()
                        .focus()
                ;
                return this;
            },
            signIn: function (input) {
                var view = this,
                    $button = this.$('button[type="submit"]').attr('disabled', true);
                this.renderError();
                TopPatch.Auth.signIn(input.name, input.password).then(
                    function () {
                        var attemptedRoute = TopPatch.Auth.attemptedRoute;
                        if (attemptedRoute) {
                            TopPatch.router.navigate(attemptedRoute, {trigger: true});
                            TopPatch.Auth.attemptedRoute = null;
                        } else {
                            TopPatch.router.navigate('', {trigger: true});
                        }
                    },
                    function (jqxhr, status, message) {
                        var loginResponse;
                        if (jqxhr.status === 401) {
                            loginResponse = 'Invalid username and/or password.';
                        } else {
                            loginResponse = message;
                        }
                        view.renderError(loginResponse);
                        $button.attr('disabled', false);
                        return this;
                    }
                );
                return this;
            }
        });
    }
);
