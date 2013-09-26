$(document).ready(function () {
    'use strict';
    module('Button');

    asyncTest('Events', function () {
        require(['core/js/control/button'], function(Button) {
            var button = new Button();

            // Since the constructor creates the events,
            // just test the new instance of Button

            var events = button._events;
            ok(!_.isUndefined(events), '_events property is defined');
            deepEqual(_.keys(events), [
                'change:title',
                'change:style',
                'change:disabled',
                'change:returnValue'
            ], '_events property has correct events');

            strictEqual(events['change:title'][0].callback   , button._changeTitle   , 'change:title has correct callback');
            strictEqual(events['change:style'][0].callback   , button._changeStyle   , 'change:style has correct callback');
            strictEqual(events['change:disabled'][0].callback, button._changeDisabled, 'change:disabled has correct callback');
            strictEqual(events['change:returnValue'][0].callback   , button._changeReturnValue   , 'change:returnValue has correct callback');

            start();
        });
    });

    asyncTest('_ensureElement', function () {
        require(['core/js/control/button'], function(Button) {
            var button = new Button();

            // Since the constructor calls _ensureElement,
            // just test the new instance of Button

            ok(!_.isUndefined(button.$el), 'button.$el is defined');
            ok(button.$el instanceof Backbone.$, 'Button.$el is instance of $');

            ok(!_.isUndefined(button.el), 'button.el is defined');

            var $el = button.$el;
            strictEqual($el.attr('id'), button.cid, 'Element ID is correct');
            ok($el.hasClass('btn'), 'Element has `btn` class');

            var style = button.get('style');
            ok($el.hasClass(style), 'Element has `' + style + '` class');

            strictEqual($el.data('returnValue'), button.get('returnValue'), 'Button has correct returnValue');

            strictEqual($el.text(), button.get('title'), 'Button has correct title text');

            start();
        });
    });

    asyncTest('Validate', function () {
        require(['core/js/control/button'], function(Button) {
            var button = new Button(),
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

            result = validate({returnValue:32});
            strictEqual(result, validResult, '32 is a valid returnValue');

            result = validate({returnValue:' '});
            notStrictEqual(result, validResult, '" " is NOT a valid returnValue');

            result = validate({keyEquivalent:32});
            strictEqual(result, validResult, '32 is a valid keyEquivalent');

            result = validate({keyEquivalent:' '});
            notStrictEqual(result, validResult, '" " is NOT a valid keyEquivalent');

            start();
        });
    });

    asyncTest('Set', function () {
        require(['core/js/control/button'], function(Button) {
            var button = new Button();

            // Test to make sure that set trims the title value
            button.set('title', 'Test     ');
            strictEqual(button.get('title'), 'Test', 'Trimmed title "Test     " to "Test"');

            // Test to make sure that set trims the style value
            button.set('style', 'Test     ');
            strictEqual(button.get('style'), 'Test', 'Trimmed style "Test     " to "Test"');

            // Test to make sure we are coercing the keyEquivalent to a characterCode (Number)
            button.set('keyEquivalent', ' ');
            strictEqual(button.get('keyEquivalent'), 32, 'Coerced " " to character code 32');

            start();
        });
    });

    asyncTest('Remove', function () {
        require(['core/js/control/button'], function(Button) {
            var button = new Button();

            button.$el.appendTo($('body'));

            button.remove();

            strictEqual(button.$el.parents().length, 0, 'Button was removed successfully');

            start();
        });
    });

    asyncTest('_changeTitle', function () {
        require(['core/js/control/button'], function(Button) {
            var button = new Button();

            ok(button._changeTitle(), 'Run _changeTitle');
            strictEqual(button.$el.text(), 'Button', 'Applied default title to element text');

            start();
        });
    });

    asyncTest('_changeStyle', function () {
        require(['core/js/control/button'], function(Button) {
            var button = new Button();

            ok(button._changeStyle(), 'Run _changeStyle');
            ok(button.$el.hasClass('btn-default'), 'Applied default style to element class');

            ok(button.set('style', 'btn-primary'), 'Directly set the button\'s style');
            ok(button._changeStyle(), 'Run _changeStyle');
            ok(button.$el.hasClass('btn-primary'), 'Switched style on element class');

            start();
        });
    });

    asyncTest('_changeDisabled', function () {
        require(['core/js/control/button'], function(Button) {
            var button = new Button();


            ok(button.set('disabled', true), 'Directly set the button\'s disabled value');
            ok(button._changeDisabled(), 'Run _changeDisabled');
            strictEqual(button.$el.attr('disabled'), 'disabled', 'Set element\'s disabled value to true');

            ok(button.set('disabled', false), 'Directly set the button\'s disabled value');
            ok(button._changeDisabled(), 'Run _changeDisabled');
            strictEqual(button.$el.attr('disabled'), undefined, 'Set element\'s disabled value to undefined');

            start();
        });
    });

    asyncTest('_changeReturnValue', function () {
        require(['core/js/control/button'], function(Button) {
            var button = new Button();

            ok(button._changeReturnValue(), 'Run _changeReturnValue');
            strictEqual(button.$el.data('returnValue'), 0, 'Set element\'s data("returnValue") to default of 0');

            start();
        });
    });

    asyncTest('canPerform', function () {
        require(['core/js/control/button'], function(Button) {
            var button = new Button(),
                $body = $('body');

            strictEqual(button.canPerform(), false, 'returned false, button is not visible');

            button.$el.appendTo($body);

            strictEqual(button.canPerform(), true, 'returned true, button is visible');

            button.set('disabled', true);

            strictEqual(button.canPerform(), false, 'returned false, button is disabled');

            button.remove();

            start();
        });
    });

    asyncTest('performClick', function () {
        require(['core/js/control/button'], function(Button) {
            var button = new Button(),
                $body = $('body'),
                clicked = 0;

            button.$el.on('click', function () { clicked += 1; });

            ok(button.performClick(), 'Run performClick()');
            strictEqual(clicked, 0, 'Button not visible, click did not fire');

            ok(button.$el.appendTo($body), 'Append button to body');
            ok(button.performClick(), 'Run performClick()');
            strictEqual(clicked, 1, 'Click fired');

            var called = 0;
            button._startAnimatedClick = function () {
                called += 1;
            };

            clicked = 0;
            ok(button.performClick(true), 'Run performClick(true)');
            strictEqual(called, 1, 'Called _startAnimatedClick');
            strictEqual(clicked, 0, 'Click deferred');

            button.remove();

            start();
        });
    });

    asyncTest('_startAnimatedClick and _completeAnimatedClick', function () {
        require(['core/js/control/button'], function(Button) {
            var button = new Button(),
                postAnimationTests;

            postAnimationTests = function () {
                ok(Date.now() - startTime > 90, 'Second startAnimatedClick supplanted the first');
                ok(true, 'performClick was called by _completeAnimatedClick');
                ok(!button.$el.hasClass('active'), 'Active class was removed from Button\'s element');
                ok(_.isNull(button._animatedClickTimeout), '_animatedClickTimeout has been set back to null');
                start(); // Tell QUnit to resume testing
            };

            button.performClick = postAnimationTests;

            var startTime = Date.now();
            ok(button._startAnimatedClick(20), 'Start animation, with duration of 20 milliseconds');
            stop(); // Tell QUnit to wait for second start() (in postAnimationTests)

            ok(_.isNumber(button._animatedClickTimeout), '_animatedClickTimeout is number');
            ok(button.$el.hasClass('active'), 'Active class was added to Button\'s element');


            // This second call should cancel the first time out
            ok(button._startAnimatedClick(), 'Start animation again, with default duration');

            button.$el.remove();

            start();
        });
    });

    asyncTest('performKeyEquivalent', function () {
        require(['core/js/control/button', 'jquery.simulate'], function(Button) {
            var button = new Button(),
                called = 0, args,
                result;

            button.set('keyEquivalent', ' ');
            button.performClick = function () {
                args = _.toArray(arguments);
                called += 1;
            };
            button.$el.on('keypress', function () {
                button.performKeyEquivalent.apply(button, arguments);
            });

            button.$el.appendTo($('body'));
            ok(button.$el.simulate('keypress', { keyCode: $.simulate.keyCode.SPACE }), 'Simulate keypress event');
            strictEqual(called, 1, 'called performClick');

            called = 0;
            args = null;
            result = button.performKeyEquivalent({ which: $.simulate.keyCode.SPACE }, true);
            strictEqual(result, true, 'returned true, key matched');
            strictEqual(called, 1, 'performClick called by performKeyEquivalent');
            deepEqual(args, [true], 'passed true to performClick');

            called = 0;
            args = null;
            result = button.performKeyEquivalent({ which: $.simulate.keyCode.ENTER });
            strictEqual(result, false, 'returned false, key did not match');
            strictEqual(called, 0, 'performClick not called');

            called = 0;
            args = null;
            button.set('disabled', true);
            result = button.performKeyEquivalent({ which: $.simulate.keyCode.SPACE }, true);
            strictEqual(result, false, 'returned false, button disabled');

            button.$el.remove().off();
            start();
        });
    });
});
