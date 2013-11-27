/**
 * A TemplateView that manages a Form
 * @class basicFormView
 * @extends TemplateView
 */
define(
    ['core/js/templateView'],
    function (TemplateView) {
        'use strict';

        return TemplateView.extend({
            /**
             * Listen for DOM element events
             * Uses a function to inherit events
             * @attribute events
             * @type Object|Function
             * @default Function
             * @protected
             */
            events: function () {
                return _.extend(
                    {
                        'submit form': 'submit'
                    },
                    _.result(TemplateView.prototype, 'events')
                );
            },

            /**
             * Serialize the form and trigger the submit event at the backbone level
             * @method submit
             * @param event {Event}
             * @returns {this}
             */
            submit: function (event) {
                if (_.isObject(event)) { event.preventDefault(); }
                this.trigger('submit', this.serializeForm());
                return this;
            },

            /**
             * Serialize the form into an Object ready for conversion to JSON
             * @method serializeForm
             * @returns {Object}
             * @protected
             */
            serializeForm: function () {
                var output = {};
                var input = this.$('form').serializeArray();
                $.each(input, function() {
                    if (output[this.name] !== undefined) {
                        if (!output[this.name].push) {
                            output[this.name] = [output[this.name]];
                        }
                        output[this.name].push(this.value || '');
                    } else {
                        output[this.name] = this.value || '';
                    }
                });
                return output;
            },
        });
    }
);
