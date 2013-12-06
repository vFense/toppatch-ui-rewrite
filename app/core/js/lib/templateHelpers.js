/**
 * @class Handlebars.helpers
 * @static
 */
define(
    ['../../../.'],
    function (Handlebars) {
        'use strict';

        /**
         * {{#compare}}...{{/compare}}
         *
         * @method compare
         * @credit OOCSS via Assemble's handlebars-helpers
         * @param left value
         * @param operator The operator, must be between quotes ">", "=", "<=", etc...
         * @param right value
         * @param options option object sent by handlebars
         * @return {String} formatted html
         *
         * @example
         *   {{#compare unicorns "<" ponies}}
         *     I knew it, unicorns are just low-quality ponies!
         *   {{/compare}}
         *
         *   {{#compare value ">=" 10}}
         *     The value is greater or equal than 10
         *     {{else}}
         *     The value is lower than 10
         *   {{/compare}}
         */
        Handlebars.registerHelper('compare', function (left, operator, right, options) {
            /*jshint eqeqeq: false*/

            if (arguments.length < 3) {
                throw new Error('Handlerbars Helper "compare" needs 2 parameters');
            }

            if (options === undefined) {
                options = right;
                right = operator;
                operator = '===';
            }

            var operators = {
                '==':     function(l, r) {return l == r; },
                '===':    function(l, r) {return l === r; },
                '!=':     function(l, r) {return l != r; },
                '!==':    function(l, r) {return l !== r; },
                '<':      function(l, r) {return l < r; },
                '>':      function(l, r) {return l > r; },
                '<=':     function(l, r) {return l <= r; },
                '>=':     function(l, r) {return l >= r; },
                'typeof': function(l, r) {return typeof l == r; }
            };

            if (!operators[operator]) {
                throw new Error('Handlerbars Helper "compare" doesn\'t know the operator ' + operator);
            }

            var result = operators[operator](left, right);

            if (result) {
                return options.fn(this);
            } else {
                return options.inverse(this);
            }
        });

        /**
         * Generate a list of options for use in a `<select>`, or `<datalist>`, tag.
         * {{#options arrayOfOptions}}{{/options}}
         *
         * @method options
         * @param array Array of objects describing each option's attributes
         * @return {Handlebars.SafeString} Object containing a string of all generated options
         *
         * @example
         *   {{#options [
         *     {disabled:true, selected:true, value:'value', label:'label' },
         *     {value:'value2',label:'label2'}
         *   ]
         *
         *   ```html
         *   <option disabled label="label" selected value="value"></option>
         *   <option label="label2" value="value2"></option>
         *   ```
         */
        Handlebars.registerHelper('options', function (array) {
            var buffer = array.map(function (item) {
                var value, selected, label, disabled;
                disabled = item.disabled ? ' disabled' : '';
                label = item.label ? ' label="' + item.label + '"' : '';
                selected = item.selected ? ' selected' : '';
                value = item.value ? ' value="' + item.value + '"' : '';
                return '<option' + disabled + label + selected + value + '></option>';
            }).join('\n');
            return new Handlebars.SafeString(buffer);
        });

        return Handlebars;
    }
);
