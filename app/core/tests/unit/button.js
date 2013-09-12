$(document).ready(function () {
    'use strict';
    module('Button.Model');

    asyncTest('Validate', function () {
        require(['core/js/button'], function(Button) {
            var button = new Button.Model(),
                validate = button.validate,
                validResult = '',
                result;

            result = validate({title:'test'});
            strictEqual(result, validResult, '"test" is a valid title');

            result = validate({title: 1});
            notStrictEqual(result, validResult, '1 is NOT a valid title');

            result = validate({style:'test'});
            strictEqual(result, validResult, '"test" is a valid style');

            result = validate({style: 1});
            notStrictEqual(result, validResult, '1 is NOT a valid style');

            result = validate({disabled:true});
            strictEqual(result, validResult, 'true is a valid disabled value');

            result = validate({disabled:1});
            notStrictEqual(result, validResult, '1 is NOT a valid disabled value');

            result = validate({tag:32});
            strictEqual(result, validResult, '32 is a valid tag');

            result = validate({tag:' '});
            notStrictEqual(result, validResult, '" " is NOT a valid tag');

            result = validate({keyEquivalent:32});
            strictEqual(result, validResult, '32 is a valid keyEquivalent');

            result = validate({keyEquivalent:' '});
            notStrictEqual(result, validResult, '" " is NOT a valid keyEquivalent');

            start();
        });
    });

    asyncTest('Set', function () {
        require(['core/js/button'], function(Button) {
            var button = new Button.Model();

            // Test to make sure that set trims the title value
            button.set('title', 'Test     ');
            strictEqual(button.get('title'), 'Test', 'Trimmed "Test     " to "Test"');

            // Test to make sure we are coercing the keyEquivalent to a characterCode (Number)
            button.set('keyEquivalent', ' ');
            strictEqual(button.get('keyEquivalent'), 32, 'Coerced " " to character code 32');

            start();
        });
    });
});
