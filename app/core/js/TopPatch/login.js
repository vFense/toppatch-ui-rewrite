define(
    ['core/js/forms/form', 'core/template/login'],
    function (Form, template) {
        'use strict';
        return Form.extend({
            template: template,
            live: true,
            loginError: false,
            loginResponse: '',
            initialize: function () {
                this.on('invalid', this.renderError);
                this.on('submit', this.signIn);
                return this;
            },
            renderError: function (view, error) {
                this.$('.alert').text(error).toggleClass('hide', false);
                return this;
            },
            signIn: function (input) {
                var view = this,
                    $button = this.$('button[type="submit"]').attr('disabled', true);
                this.$('.alert').text('').toggleClass('hide', true);
                TopPatch.Auth.signIn(input.name, input.password).then(
                    function () {
                        this.loginError = false;
                        var attemptedRoute = TopPatch.Auth.attemptedRoute;
                        if (attemptedRoute) {
                            TopPatch.router.navigate(attemptedRoute, {trigger: true});
                            TopPatch.Auth.attemptedRoute = null;
                        } else {
                            TopPatch.router.navigate('', {trigger: true});
                        }
                    },
                    function (jqxhr, status, message) {
                        view.loginError = true;
                        if (jqxhr.status === 401) {
                            view.loginResponse = 'Invalid username and/or password.';
                        } else {
                            view.loginResponse = message;
                        }
                        view.renderError(view, view.loginResponse);
                        $button.attr('disabled', false);
                        return this;
                    }
                );
            }
        });
    }
);
