$(document).ready(function () {
    'use strict';
    module('views/modal/form');
    asyncTest('constructor', function () {
        require(
            ['core/js/views/modal/form'],
            function (FormView) {
                var modalForm;
                ok(modalForm = new FormView(), 'create new modal form');
                ok(_.isFunction(modalForm.toggleAnimate), 'modal form has toggleAnimate method from modal parent');
                ok(_.isFunction(modalForm.submit), 'modal form has submit method from form parent');
                start();
            }
        );
    });

    asyncTest('render', function () {
        require(
            ['core/js/views/modal/form'],
            function (Form) {
                var form = new Form({
                    animate: false,
                    template: _.template('<form><input type="text" name="field1" value="42"/></form>')
                });

                ok(form.render(), 'render executed without error');
                ok(_.has(form._events, 'submit'), 'Form has "submit" event registered');
                strictEqual(form._events.submit.length, 1, 'Submit event has one listener');

                ok(form.render(), 'execute render again');
                strictEqual(form._events.submit.length, 1, 'Submit event still has one listener');

                form.close();
                start();
            }
        );
    });

    asyncTest('hide on submit', function () {
        require(
            ['core/js/views/modal/form'],
            function (Form) {
                var form = new Form({
                        animate: false,
                        template: _.template('<form><input type="text" name="field1" value="42"/></form>')
                    });

                form.render();
                ok(form.submit(), 'Submit form');
                ok(form.isClosed, 'modal is closed after submit');

                start();
            }
        );
    });
});
