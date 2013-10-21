define(
    ['core/js/modal/modalView', 'core/template/modalForm'],
    function (ModalView, template) {
        'use strict';
        return ModalView.extend({
            template: template,
            templateForm: null,
            events: _.extend({
                'click .reset': 'reset',
                'click .submit': 'submit',
                'keyup': 'keyEventHandler'
            }, _.result(ModalView.prototype, 'events')),
            render: function () {
                this.isClosed = false;

                // Render the modal template
                if (_.isFunction(this.template)) {
                    this.$el.html(this.template());
                } else {
                    var error = new TypeError('Template is not a function');
                    error.name = 'TemplateNotFunction';
                    throw error;
                }

                // render the form template
                if (_.isFunction(this.templateForm)) {
                    var data = this.getData(),
                        html = this.templateForm(data);
                    this.$('form').html(html);
                }

                return this;
            },
            reset: function (event) {
                if (_.isObject(event)) { event.preventDefault(); }
                this.$('form')[0].reset();
                return this;
            },
            submit: function (event) {
                if (_.isObject(event)) { event.preventDefault(); }
                this.trigger('submit', this.serializeForm());
                return this.hide();
            },
            keyEventHandler: function (event) {
                if (event.which === 13) {
                    return this.submit(event);
                }
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
            }
        });
    }
);
