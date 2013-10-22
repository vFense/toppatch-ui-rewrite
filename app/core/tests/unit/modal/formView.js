$(document).ready(function () {
    'use strict';
    module('FormView', {
        setup: function () {
            this.testTemplate = '<input type="text" name="test"/>';
        }
    });

    asyncTest('Constructor', function () {
        var suite = this;
        require(
            ['core/js/modal/formView'],
            function (FormView) {
                var formView;
                //default constructor
                formView = new FormView();
                ok(formView instanceof FormView, 'Created default instance of FormView');
                ok(_.isFunction(formView.template), 'FormView template is a function');
                ok(_.isNull(formView.templateForm), 'FormView templateForm is initialized as null');

                //constructor with options
                formView = new FormView({
                    templateForm: _.template(suite.testTemplate)
                });
                ok(formView instanceof FormView, 'Created instance of FormView with options');
                ok(_.isFunction(formView.templateForm), 'FormView templateForm is a function');
                start();
            }
        );
    });

    asyncTest('Render empty form', function () {
        require(
            ['core/js/modal/formView'],
            function (FormView) {
                var formView = new FormView(),
                    $el = formView.render().$el;
                console.log($el[0]);
                start();
            }
        )
    });
});