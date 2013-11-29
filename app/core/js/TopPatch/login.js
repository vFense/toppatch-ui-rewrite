define(
    ['core/js/TopPatch/auth', 'core/js/forms/validatingForm', 'core/template/login'],
    function (Auth, FormView, template) {
        'use strict';
        return FormView.extend({
            template: template,
            live: true,
            initialize: function () {
                this.on('invalid', this.renderError);
                this.on('submit', this.signIn);
            },
            renderError: $.noop,
            signIn: $.noop
        });
    }
);
