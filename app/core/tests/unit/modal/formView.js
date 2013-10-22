$(document).ready(function () {
    'use strict';
    module('FormView', {
        setup: function () {
            this.testInput = $('<input>').attr({type: 'text', name: 'test'});
            this.testSelect = $('<select></select>')
                .attr({name: 'select'})
                .append($('<option></option>').val('default'));
        }
    });
    asyncTest('Form Reset', function () {
        var suite = this;
        require(
            ['core/js/modal/formView', 'core/template/modalForm'],
            function (FormView, FormTemplate) {
                var testValue = 'test',
                    formView = new FormView({
                        template: FormTemplate
                    }),
                    $el = formView.render().$el,
                    $form = $el.find('form'),
                    $input = $form.append(suite.testInput.val(testValue)).find('input');
                ok(formView instanceof FormView, 'Created instance of FormView');
                strictEqual($input.val(), testValue, 'Test input contains value test');
                strictEqual(formView.reset(), formView, 'formView.reset returns formView');
                ok(_.isEmpty($input.val()), 'Input is reset');
                start();
            }
        )
    });

    asyncTest('clickEventHandler', function () {
        var suite = this;
        require(
            ['core/js/modal/formView', 'core/template/modalForm', 'jquery.simulate'],
            function (FormView, FormTemplate) {
                var formView, calls = 0;

                FormView = FormView.extend({
                    submit: function (event) {
                        calls += 1;
                        this.hide();
                    }
                });
                formView = new FormView({
                    template: FormTemplate
                });

                formView.open();
                ok(formView.$el.simulate('keyup', { keyCode: $.simulate.keyCode.ENTER }), 'Simulate enter key event');
                strictEqual(calls, 1, 'Submit function is called');

                start();
            }
        );
    });

    asyncTest('Submit Form', function () {
        var suite = this;
        require(
            ['core/js/modal/formView', 'core/template/modalForm'],
            function (FormView, FormTemplate) {
                var formView, calls = 0;

                formView = new FormView({
                    template: FormTemplate
                });
                formView.on('submit', function () {
                    calls += 1;
                });
                formView.open().submit();
                strictEqual(calls, 1, 'Submit event is triggered');
                strictEqual(formView.isShown(), false, 'Modal closed after event');

                start();
            }
        );
    });

    asyncTest('Serialize Form', function () {
        var suite = this;
        require(
            ['core/js/modal/formView', 'core/template/modalForm'],
            function (FormView, FormTemplate) {
                var testObject = {
                        test: ['test', 'testTwo', 'testThree'],
                        select: 'default'
                    },
                    formView = new FormView({
                        template: FormTemplate
                    }),
                    $el = formView.render().$el,
                    result;
                $el.find('form').append(
                    suite.testInput.val('test'),
                    suite.testInput.clone().val('testTwo'),
                    suite.testInput.clone().val('testThree'),
                    suite.testSelect
                );
                formView.on('submit', function (output) {
                    result = output;
                });
                formView.open().submit();
                deepEqual(result, testObject, 'Form serialized correctly');
                start();
            }
        );
    });

});