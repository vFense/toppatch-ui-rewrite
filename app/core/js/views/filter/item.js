define(
    ['core/js/templateView', 'backbone.validation'],
    function (TemplateView) {
        'use strict';

        // List of view options to be merged as properties
        var viewOptions = ['name', 'label'];

        return TemplateView.extend({
            tagName: 'span',

            _enabled: false,

            constructor: function (options) {
                if (_.isObject(options)) {
                    _.extend(this, _.pick(options, viewOptions));
                }

                if (!_.isString(this.name)) {
                    throw new Error('Filter item requires a name');
                }

                if (!_.isString(this.label)) {
                    throw new Error('Filter item requires a label');
                }

                return TemplateView.prototype.constructor.apply(this, arguments);
            },

            enabled: function () {
                return this._enabled;
            },
            toggleEnabled: function (bool) {
                if (_.isBoolean(bool)) {
                    this._enabled = bool;
                } else {
                    this._enabled = !this._enabled;
                }
                return this;
            },

            // Validation methods
        });
    }
);
