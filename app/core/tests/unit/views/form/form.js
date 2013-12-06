$(document).ready(function () {
    'use strict';
    module('forms/formView');

    asyncTest('constructor', function () {
        require(
            ['core/js/views/form/form'],
            function (Form) {
                ok(new Form(), 'New form, no options; Init without error');

                var validate = function () {
                        return 'Never valid';
                    },
                    form;

                ok(form = new Form({validate: validate}), 'New form, validate option passed; Init without error');
                strictEqual(form.validate, validate, 'Form.validate is correct');

                start();
            }
        );
    });

    asyncTest('serializeForm', function () {
        require(
            ['core/js/views/form/form'],
            function (Form) {
                var form = new Form({
                    template: _.template([
                        '<form>',
                        '<input type="text" name="field1" value="1"/>',
                        '<input type="text" name="field2" value="2-1"/>',
                        '<input type="text" name="field2" value="2-2"/>',
                        '<input type="text" name="field2" value="2-3"/>',
                        '<input type="text" name="field3" value="3" disabled/>',
                        '<select name="field4"><option value="4-1"></option><option value="4-2" selected></option></select>',
                        '<input type="hidden" name="field5" value="5"></hidden>',
                        '<input type="checkbox" name="field6"/>',
                        '<input type="checkbox" name="field7" checked/>',
                        '<input type="hidden" name="field8"/>',
                        '<input type="hidden" name="field8"/>',
                        '</form>'
                    ].join('\n'))
                });

                var data = form.render().serializeForm();
                deepEqual(data, {
                    field1: '1',
                    field2: ['2-1','2-2', '2-3'],
                    field4: '4-2',
                    field5: '5',
                    field7: 'on',
                    field8: ['', '']
                }, 'Form serialized correctly');

                ok(_.isUndefined(data.field3), 'Field 3 is undefined because the input is disabled');
                ok(_.isUndefined(data.field6), 'Field 6 is undefined because the input is not checked');
                start();
            }
        );
    });

    asyncTest('_validate and isValid', function () {
        require(
            ['core/js/views/form/form'],
            function (Form) {
                var form = new Form({
                        template: _.template('<form><input type="number" name="field1" required /></form>')
                    }),
                    $form = form.render().$('form');

                strictEqual(form._validate(), true, '_validate while validate is undefined, returns true');
                strictEqual(form.isValid(), true, 'isValid while validate is undefined, returns true');

                form.validate = function () {
                    var valid = $form[0].checkValidity();
                    if (!valid) {
                        return 'invalid';
                    }
                    return;
                };

                strictEqual(form._validate(), false, '_validate returns false');
                strictEqual(form.isValid(), false, 'isValid returns false');

                $form.find('[name="field1"]').val(42);

                strictEqual(form._validate(), true, '_validate returns true');
                strictEqual(form.isValid(), true, 'isValid returns true');

                start();
            }
        );
    });

    asyncTest('submit', function () {
        require(
            ['core/js/views/form/form'],
            function (Form) {
                var form = new Form({
                        template: _.template('<form><input type="text" name="field1" value="42"/></form>')
                    }),
                    timeout;

                form.render();
                form.once('submit', function (data) {
                    clearTimeout(timeout);
                    ok(true, 'Submit event captured');

                    ok(_.isObject(data), 'event passed data object');

                    deepEqual(data, {
                        field1: '42'
                    }, 'serialized form is correct');

                    start();
                });

                timeout = setTimeout(function () {
                    form.off();

                    ok(false, 'Submit event NOT captured within specified timeout');

                    start();
                }, 100);

                form.$('form').submit();
            }
        );
    });

    asyncTest('submit invalid', function () {
        require(
            ['core/js/views/form/form'],
            function (Form) {
                var message = 'form invalid',
                    form = new Form({
                        template: _.template('<form><input type="text" name="field1" required/></form>'),
                        validate: function () {
                            if (!this.$('form')[0].checkValidity()) {
                                return message;
                            }
                        }
                    }),
                    timeout;

                form.render();
                form.once('invalid', function (error) {
                    clearTimeout(timeout);
                    ok(true, 'Invalid event captured');
                    strictEqual(error, message, 'Error message is correct');
                    start();
                });

                timeout = setTimeout(function () {
                    form.off();

                    ok(false, 'Invalid event NOT captured within specified timeout');

                    start();
                }, 100);

                form.$('form').submit();
            }
        );
    });
});
