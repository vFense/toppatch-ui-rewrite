define(
    ['core/js/templateView', 'core/js/template/dialogView', 'bootstrap.modal'],
    function (TemplateView, template) {
        'use strict';
        // List of view options to be merged as properties
        var viewOptions = ['animate', 'keyboard', 'backdrop'];

        return TemplateView.extend({
            className: 'modal',
            attributes: function () {
                return _.extend({}, _.result(TemplateView.prototype, 'attributes'), {
                    'tabindex': '-1',
                    'role': 'dialog'
                });
            },
            template: template,

            // --------------------------------------------------------
            // variables to pass to bootstrap-modal
            // --------------------------------------------------------
            animate: false,
            keyboard: true,
            backdrop: true,

            /**
             * Extend this instance with keys of special meaning (see `viewOptions`),
             * then call the parent constructor
             * @param options
             * @returns {this}
             */
            constructor: function (options) {
                if (_.isObject(options)) {
                    _.extend(this, _.pick(options, viewOptions));
                }
                TemplateView.prototype.constructor.apply(this, arguments);
                this.toggleAnimate(this.animate);
                return this;
            },

            /**
             * Listen for the bootstrap.modal hidden event
             * Use a function so we can inherit events
             * @returns {Object}
             */
            events: function () {
                return _.extend({}, _.result(TemplateView.prototype, 'events'), {
                    'hidden.bs.modal': function () {
                        this.close();
                    }
                });
            },

            // --------------------------------------------------------
            // Dialog utility methods
            // --------------------------------------------------------
            /**
             * Method to get the shown status of this DialogView
             * Uses the Bootstrap Modal isShown value
             * @returns {boolean}
             */
            isShown: function () {
                var data = this.$el.data('bs.modal');
                return _.isUndefined(data) ? false : data.isShown;
            },

            /**
             * Method to show the boostrap.modal
             * @returns {this}
             */
            open: function () {
                var $el = this.$el;
                if (!this.isShown()) {
                    if(this.isClosed === true || _.isUndefined(this.isClosed)) {
                        this.render();
                    }

                    this.delegateEvents();
                    
                    // Set bootstrap modal options
                    $el.modal({
                        keyboard: this.keyboard,
                        backdrop: this.backdrop
                    });
                }

                return this;
            },

            /**
             * Toggle the modal 'fade' class which instructs bootstrap.modal to animate
             * @param state {boolean} A boolean value to determine whether the class should be added or removed.
             * @returns {this}
             */
            toggleAnimate: function (state) {
                if (_.isBoolean(state)) {
                    this.animate = state;
                } else {
                    this.animate = !this.animate;
                }
                this.$el.toggleClass('fade', this.animate);
                return this;
            },

            /**
             * Method to hide the bootstrap.modal
             * Once hidden, this DialogView will close
             * @returns {this}
             */
            hide: function () {
                this.$el.modal('hide');
                return this;
            },

            /**
             * If the bootstrap.modal is shown, hide it
             * @returns {this}
             */
            close: function () {
                if (!this.isClosed) {
                    if (this.isShown()) {
                        this.hide();
                    } else {
                        TemplateView.prototype.close.apply(this, arguments);
                    }
                }
                return this;
            }
        });
    }
);
