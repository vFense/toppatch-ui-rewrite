/**
 * A TemplateView that manages a Form
 * @class basicFormView
 * @extends TemplateView
 */
define(
    ['../templateView'],
    function (TemplateView) {
        'use strict';

        return TemplateView.extend({
            /**
             * Listen for element events
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

            submit: function (event) {
                if (_.isObject(event)) { event.preventDefault(); }
                this.trigger('submit', this.serializeForm());
                return this;
            },

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
