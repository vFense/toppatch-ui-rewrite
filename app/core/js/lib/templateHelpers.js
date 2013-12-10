/**
 * @class Handlebars.helpers
 * @static
 */
define(
    function (require) {
        'use strict';
        var Handlebars = require('handlebars');
        Handlebars.registerHelper('compare', require('./templateHelpers/compare'));
        Handlebars.registerHelper('options', require('./templateHelpers/options'));

        return Handlebars;
    }
);
