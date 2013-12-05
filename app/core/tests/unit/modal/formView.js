$(document).ready(function () {
    'use strict';
    module('modal/form');
    asyncTest('constructor', function () {
        require(
            ['core/js/modal/formView'],
            function (FormView) {
                var modalForm;
                ok(modalForm = new FormView(), 'create new modal form');
                ok(_.isFunction(modalForm.toggleAnimate), 'modal form has toggleAnimate method from modal parent');
                ok(_.isFunction(modalForm.submit), 'modal form has submit method from form parent');
                start();
            }
        );
    });

    asyncTest('hide on submit', function () {
        require(
            ['core/js/modal/formView'],
            function (Form) {
                var form = new Form({
                        animate: false,
                        template: _.template('<form><input type="text" name="field1" value="42"/></form>')
                    });

                form.render();
                ok(form.submit(), 'Submit form');
                ok(form.isClosed, 'modal is closed after submit');

                form.render();
                ok(!form.isClosed, 'modal is NOT closed after re-render');
                ok(form.submit(), 'Submit form again');
                ok(form.isClosed, 'modal is closed after second submit');

                start();
            }
        );
    });
});
