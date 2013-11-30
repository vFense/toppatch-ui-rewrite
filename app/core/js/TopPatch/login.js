define(
    ['core/js/forms/validatingForm', 'core/template/login'],
    function (FormView, template) {
        'use strict';
        return FormView.extend({
            template: template,
            live: true,
            loginError: false,
            loginResponse: '',
            initialize: function () {
                this.on('invalid', this.renderError);
                this.on('submit', this.signIn);
            },
            renderError: $.noop,
            signIn: function (input) {
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
                        this.loginError = true;

                        if (jqxhr.status === 401) {
                            this.loginResponse = 'Invalid username and/or password.';
                        } else {
                            this.loginResponse = message;
                        }

                        return this;
                    }
                );
            }
        });
    }
);
