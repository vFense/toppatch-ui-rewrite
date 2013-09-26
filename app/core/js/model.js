/**
 * A [Backbone.Model](http://backbonejs.org/#Model) extended with
 * [Backbone.Validation](https://github.com/thedersen/backbone.validation)
 *
 * @class Model
 */
define(
    ['backbone.validation'],
    function (validation) {
        'use strict';
        return Backbone.Model.extend(validation.mixin);
    }
);
