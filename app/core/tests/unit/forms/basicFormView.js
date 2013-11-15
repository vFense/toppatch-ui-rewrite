$(document).ready(function () {
    'use strict';
    module('forms/basicFormView');

    asyncTest('serializeForm', function () {
        require(
            ['core/js/forms/basicFormView'],
            function (BasicForm) {
                var form = new BasicForm({
                    template: _.template([
                        '<input type="text" name="field1" value="1"/>',
                        '<input type="text" name="field2" value="2-1"/>',
                        '<input type="text" name="field2" value="2-2"/>',
                        '<input type="text" name="field3" value="3" disabled/>',
                        '<select name="field4"><option value="4-1"></option><option value="4-2" selected></option></select>',
                        '<input type="hidden" name="field5" value="5"></hidden>',
                        '<input type="checkbox" name="field6"/>',
                        '<input type="checkbox" name="field7" checked/>'
                    ].join('\n'))
                });

                var data = form.render().serializeForm();
                deepEqual(data, {
                    field1: '1',
                    field2: ['2-1','2-2'],
                    field4: '4-2',
                    field5: '5',
                    field7: 'on'
                }, 'Form serialized correctly');

                ok(_.isUndefined(data.field3), 'Field 3 is undefined because the input is disabled');
                ok(_.isUndefined(data.field6), 'Field 6 is undefined because the input is not checked');
                start();
            }
        );
    });

    asyncTest('submit', function () {
        require(
            ['core/js/forms/basicFormView'],
            function (BasicForm) {
                var form = new BasicForm({
                        template: _.template('<input type="text" name="field1" value="42"/>')
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

                form.$el.submit();
            }
        );
    });
});
