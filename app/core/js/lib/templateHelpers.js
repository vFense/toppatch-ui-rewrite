/**
 * @class Handlebars.helpers
 * @static
 */
define(
    function (require) {
        'use strict';
        var Handlebars = require('handlebars');
        Handlebars.registerHelper('compare', require('./templateHelpers/compare'));

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
