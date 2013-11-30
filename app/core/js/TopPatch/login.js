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
            signIn: $.noop
        });
    }
);
