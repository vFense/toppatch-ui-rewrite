define(
    ['core/js/modal/modalView'],
    function (ModalView) {
        'use strict';
        return ModalView.extend({
            /**
             * Listens for the form reset, submit, and enter key event
             * Uses a function to inherit events
             * @attribute events
             * @type Object|Function
             * @default Object
             * @protected
             */
            events: _.extend({
                'click .reset': 'reset',
                'click .submit': 'submit',
                'keyup': 'keyEventHandler'
            }, _.result(ModalView.prototype, 'events')),
            /**
             * Resets the form
             * @method reset
             * @chainable
             * @returns {this}
             */
            reset: function (event) {
                if (_.isObject(event)) { event.preventDefault(); }
                this.$('form')[0].reset();
                return this;
            },
            /**
             * Triggers form submit and closes it
             * @method submit
             * @chainable
             * @returns {this}
             */
            submit: function (event) {
                if (_.isObject(event)) { event.preventDefault(); }
                this.trigger('submit', this.serializeForm());
                return this.hide();
            },
            /**
             * Submit the form if the key pressed is "Enter/Return"
             * @method keyEventHandler
             * @param event {Event}
             * @chainable
             * @returns {this}
             * @protected
             */
            keyEventHandler: function (event) {
                if (event.which === 13) {
                    return this.submit(event);
                }
            },
            /**
             * Returns object containing a serialized object of the form
             * @method serializeForm
             * @returns {object}
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
            }
        });
    }
);
