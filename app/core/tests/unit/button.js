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

            result = validate({tagID:32});
            strictEqual(result, validResult, '32 is a valid tagID');

            result = validate({tagID:' '});
            notStrictEqual(result, validResult, '" " is NOT a valid tagID');

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

    module('Button.View');
    asyncTest('Initialize', function () {
        require(['core/js/button'], function(Button) {
            var defaultButtonModel = Button.Model.prototype.defaults;
            var model = new Button.Model({ tagID: 1000 });
            var button;

            ok(button = new Button.View({ model: model }), 'Construct with instance of Button.Model');
            strictEqual(button.model, model, 'Init did not touch instance of Button.Model at this.model');

            ok(button = new Button.View(), 'Construct with no options, leaving this.model undefined');
            ok(button.model instanceof Button.Model, 'Init created instance of Button.Model at this.model');
            deepEqual(button.model.attributes, defaultButtonModel, 'model represents a default Button.Model');

            ok(button = new Button.View({model: { title: 'OK' }}), 'Construct with this.model as Object');
            ok(button.model instanceof Button.Model, 'Init created instance of Button.Model at this.model');
            strictEqual(button.model.get('title'), 'OK', 'model has correct title');

            QUnit.throws(function () {
                button = new Button.View({ model: { title: 1 }});
            }, Error, 'Constructor threw error because of invalid model');

            start();
        });
    });

    asyncTest('_setTitle', function () {
        require(['core/js/button'], function(Button) {
            var button = new Button.View();

            ok(button._setTitle(), 'Run _setTitle');
            strictEqual(button.$el.text(), 'Button', 'Applied default title to element text');

            start();
        });
    });

    asyncTest('_setStyle', function () {
        require(['core/js/button'], function(Button) {
            var button = new Button.View();

            ok(button._setStyle(), 'Run _setStyle');
            ok(button.$el.hasClass('btn-default'), 'Applied default style to element class');

            ok(button.model.set('style', 'btn-primary'), 'Directly set the button\'s style');
            ok(button._setStyle(), 'Run _setStyle');
            ok(button.$el.hasClass('btn-primary'), 'Switched style on element class');

            start();
        });
    });

    asyncTest('_setDisabled', function () {
        require(['core/js/button'], function(Button) {
            var button = new Button.View();


            ok(button.model.set('disabled', true), 'Directly set the button\'s disabled value');
            ok(button._setDisabled(), 'Run _setDisabled');
            strictEqual(button.$el.attr('disabled'), 'disabled', 'Set element\'s disabled value to true');

            ok(button.model.set('disabled', false), 'Directly set the button\'s disabled value');
            ok(button._setDisabled(), 'Run _setDisabled');
            strictEqual(button.$el.attr('disabled'), undefined, 'Set element\'s disabled value to undefined');

            start();
        });
    });

    asyncTest('_setTagID', function () {
        require(['core/js/button'], function(Button) {
            var button = new Button.View();

            ok(button._setTagID(), 'Run _setTagID');
            strictEqual(button.$el.data('tagID'), 0, 'Set element\'s data("tagID") to default of 0');

            start();
        });
    });

    asyncTest('Render', function () {
        require(['core/js/button'], function(Button) {
            var button = new Button.View(),
                listeners,
                listenerEvents,
                result;

            ok(result = button.render(), 'Run render');

            strictEqual(button.$el.text(), 'Button', 'Applied default title to element text');
            ok(button.$el.hasClass('btn-default'), 'Applied default style to element class');
            strictEqual(button.$el.attr('disabled'), undefined, 'Set element\'s disabled value to undefined');
            strictEqual(button.$el.data('tagID'), 0, 'Set element\'s data("tagID") to default of 0');

            listeners = _.values(result._listeners);
            strictEqual(listeners.length, 1, 'View should have 1 listener');
            listenerEvents = listeners[0]._events;
            deepEqual(_.keys(listenerEvents), [
                'change:title',
                'change:style',
                'change:disabled',
                'change:tagID'
            ], 'Listener has correct events');

            // Render again and make sure we don't have duplicate events
            ok(result = button.render(), 'Run render again');
            listeners = _.values(result._listeners);
            strictEqual(listeners.length, 1, 'View should have 1 listener');
            listenerEvents = listeners[0]._events;
            deepEqual(_.keys(listenerEvents), [
                'change:title',
                'change:style',
                'change:disabled',
                'change:tagID'
            ], 'Listener has correct events');

            // Test to make sure our model events are working
            ok(button.model.set({
                title: 'OK',
                style: 'btn-primary',
                disabled: true,
                tagID: 5
            }), 'Change model attributes directly to test if events are set up correctly');

            strictEqual(button.$el.text(), 'OK', 'Button\'s title is now "OK"');
            ok(button.$el.hasClass('btn-primary'), 'Button\'s style is now "btn-primary"');
            strictEqual(button.$el.attr('disabled'), 'disabled', 'Button is now disabled');
            strictEqual(button.$el.data('tagID'), 5, 'Button\'s tagID is now 5');

            start();
        });
    });

    asyncTest('canPerform', function () {
        require(['core/js/button'], function(Button) {
            var button = new Button.View(),
                $body = $('body');

            strictEqual(button.canPerform(), false, 'returned false, button is not visible');

            button.render().$el.appendTo($body);

            strictEqual(button.canPerform(), true, 'returned true, button is visible');

            button.model.set('disabled', true);

            strictEqual(button.canPerform(), false, 'returned false, button is disabled');

            button.$el.remove().off();

            start();
        });
    });

    asyncTest('performClick', function () {
        require(['core/js/button'], function(Button) {
            var button = new Button.View(),
                $body = $('body'),
                clicked = 0;

            button.render().$el.on('click', function () { clicked += 1; });

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

            button.$el.remove().off();

            start();
        });
    });

    asyncTest('_startAnimatedClick and _completeAnimatedClick', function () {
        require(['core/js/button'], function(Button) {
            var button = new Button.View(),
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

            button.$el.remove().off();

            start();
        });
    });

    asyncTest('performKeyEquivalent', function () {
        require(['core/js/button', 'jquery.simulate'], function(Button) {
            var button = new Button.View(),
                called = 0, args,
                result;

            button.model.set('keyEquivalent', ' ');
            button.performClick = function () {
                args = _.toArray(arguments);
                called += 1;
            };
            button.$el.on('keypress', function () {
                button.performKeyEquivalent.apply(button, arguments);
            });

            button.render();
            button.$el
                .appendTo($('body'));
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
            button.model.set('disabled', true);
            result = button.performKeyEquivalent({ which: $.simulate.keyCode.SPACE }, true);
            strictEqual(result, false, 'returned false, button disabled');

            button.$el.remove().off();
            start();
        });
    });
});
